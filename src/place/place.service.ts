import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  SEARCH_BY_ID_URL,
  SEARCH_BY_KEYWORD_KAKAO_URL,
  SEARCH_BY_TEXT_URL,
} from 'src/common/constants/google-apis.constant';
import { PlaceRepository } from 'src/place/repositories/place.repository';
import { PlaceImageRepository } from 'src/place/repositories/place-image.repository';
import { Transactional } from 'typeorm-transactional';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceDetailByGoogle } from 'src/common/interfaces/place-detail-google.interface';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { TagService } from 'src/tag/tag.service';
import { TagType } from 'src/common/enums/tag-type.enum';
import { S3Service } from 'src/place/s3.service';
import { PlaceTagRepository } from './repositories/place-tag.repository';
import { PlaceDetailRepository } from './repositories/place-detail.repository';
import { CreatePlaceTagReqDto } from './dtos/create-place-tag-req.dto';
import { Place } from './entities/place.entity';
import { throwIeumException } from 'src/common/utils/exception.util';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly placeDetailRepository: PlaceDetailRepository,
    private readonly tagService: TagService,
    private readonly s3Service: S3Service,
  ) {}

  // ---------외부 API 검색---------

  async searchKakaoLocalByKeyword(keyword: string): Promise<any> {
    const response = await axios.get(SEARCH_BY_KEYWORD_KAKAO_URL, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      params: { query: keyword, size: 3 },
    });
    const kakaoPlace = response.data;
    return kakaoPlace;
  }

  async searchGooglePlacesByText(text: string): Promise<any> {
    const place = await axios.post(
      SEARCH_BY_TEXT_URL,
      { textQuery: text, languageCode: 'ko' },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.priceLevel',
        },
      },
    );
    return place.data;
  }

  async getPlaceDetailByGooglePlaceId(
    googlePlaceId: string,
  ): Promise<PlaceDetailByGoogle> {
    const placeDetail = await axios.get(SEARCH_BY_ID_URL + googlePlaceId, {
      params: { languageCode: 'ko' },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'id,name,types,displayName,nationalPhoneNumber,formattedAddress,location,regularOpeningHours.weekdayDescriptions,primaryTypeDisplayName,addressComponents,websiteUri,allowsDogs,goodForGroups,reservable,delivery,takeout',
      },
    });

    return placeDetail.data;
  }

  // ---------내부 DB 검색---------
  async getPlaceDetailById(placeId: number): Promise<PlaceDetailResDto> {
    const place = await this.placeRepository.getPlaceDetailById(placeId);
    if (!place) {
      throwIeumException('PLACE_NOT_FOUND');
    }
    return new PlaceDetailResDto(place);
  }

  async getPlacePreviewInfoById(placeId: number): Promise<PlacePreviewResDto> {
    const place = await this.placeRepository.getPlacePreviewInfoById(placeId);
    if (!place) {
      throwIeumException('PLACE_NOT_FOUND');
    }
    return new PlacePreviewResDto(place);
  }

  async getPlacesByPlaceName(placeName: string): Promise<Place[]> {
    return await this.placeRepository.getPlacesByPlaceName(placeName);
  }

  // ---------외부 API 검색---------

  @Transactional()
  async createPlaceByKakaoLocal(keyword: string) {
    const kakaoPlace = await this.searchKakaoLocalByKeyword(keyword);
    const existedPlace = await this.placeRepository.findOne({
      where: { kakaoId: kakaoPlace.documents[0].id },
    });
    if (existedPlace) return existedPlace;

    const simplifiedAddress = kakaoPlace.documents[0].address_name.split(' ');
    const locationTags = simplifiedAddress.slice(0, 2);
    const categoryTags = kakaoPlace.documents[0].category_name.split(' > ');

    const createdPlace =
      await this.placeRepository.savePlaceByKakaoLocalSearchRes(
        kakaoPlace.documents[0],
      );

    const createdCategoryTags = await this.tagService.createTags(
      categoryTags,
      TagType.Category,
    ); // 문자열 Array와 타입을 받아서 태그를 생성하고 생성된 태그 Array를 반환
    const createdLocationTags = await this.tagService.createTags(
      locationTags,
      TagType.Location,
    );
    for (const tag of createdCategoryTags.concat(createdLocationTags)) {
      {
        await this.createPlaceTag({ placeId: createdPlace.id, tagId: tag.id });
      }
    }
    return createdPlace;
  }

  // deprecated
  // async createPlaceByKeyword(keyword: string) {
  //   //keyword로 Kakao Local API 검색, 검색 결과로 장소를 생성
  //   const kakaoPlace = await this.searchKakaoLocalByKeyword(keyword);
  //   return await this.placeRepository.savePlaceByKakaoLocalSearchRes(
  //     kakaoPlace.documents[0],
  //   );
  // }

  // ---------장소 관련 부가 정보 생성---------

  async createPlaceTag(createPlaceTagReqDto: CreatePlaceTagReqDto) {
    const existedRelation = await this.placeTagRepository.findOne({
      where: {
        placeId: createPlaceTagReqDto.placeId,
        tagId: createPlaceTagReqDto.tagId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeTagRepository.save(createPlaceTagReqDto);
  }

  async createPlaceImage(placeId: number, placeImage: Express.Multer.File) {
    //transaction 적용 필요
    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });
    if (!place) {
      throwIeumException('PLACE_NOT_FOUND');
    }
    const imageUrl = await this.s3Service.uploadPlaceImage(placeImage);

    return await this.placeImageRepository.createPlaceImage(place.id, imageUrl);
  }
}
