import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import {
  PLACES_API_BASE_URL,
  SEARCH_BY_ID_URL,
  SEARCH_BY_KEYWORD_KAKAO_URL,
  SEARCH_BY_TEXT_URL,
} from 'src/common/constants/google-apis.constant';
import { Place } from 'src/entities/place.entity';
import { PlaceRepository } from 'src/repositories/place.repository';
import {
  CreatePlaceCategoryReqDto,
  CreatePlaceImageReqDto,
  CreatePlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/repositories/place-image.repository';

import { Transactional } from 'typeorm-transactional';
import { PlaceDetailByGoogle } from 'src/common/interfaces/place-detail-google.interface';
import { PlaceDetailRepository } from 'src/repositories/place-detail.repository';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { NotValidPlaceException } from 'src/common/exceptions/place.exception';
import { TagService } from 'src/tag/tag.service';
import { TagType } from 'src/common/enums/tag-type.enum';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly placeDetailRepository: PlaceDetailRepository,
    private readonly tagService: TagService,
  ) {}

  async getPlaceDetailById(placeId: number): Promise<PlaceDetailResDto> {
    const place = await this.placeRepository.getPlaceDetailById(placeId);
    if (!place)
      throw new NotValidPlaceException('해당 장소가 존재하지 않아요.');
    return place;
    return new PlaceDetailResDto();
  }

  async searchKakaoPlaceByKeyword(keyword: string): Promise<any> {
    const response = await axios.get(SEARCH_BY_KEYWORD_KAKAO_URL, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      params: { query: keyword, size: 3 },
    });
    const kakaoPlace = response.data;
    const simplifiedAddress = kakaoPlace.documents[0].address_name.split(' ');
    const simplifiedRoadAddress =
      kakaoPlace.documents[0].road_address_name.split(' ');
    const parsedCategories = kakaoPlace.documents[0].category_name.split(' > ');
    const locationTags = simplifiedAddress.slice(0, 2);
    // return {
    //   simplifiedAddress,
    //   simplifiedRoadAddress,
    //   parsedCategories,
    //   locationTags,
    // };
    return response.data;
  }

  @Transactional()
  async createPlaceByKakao(keyword: string) {
    const kakaoPlace = await this.searchKakaoPlaceByKeyword(keyword);

    const existedPlace = await this.placeRepository.findOne({
      where: { kakaoId: kakaoPlace.documents[0].id },
    });
    if (existedPlace) return existedPlace;

    const simplifiedAddress = kakaoPlace.documents[0].address_name.split(' ');
    const categoryTags = kakaoPlace.documents[0].category_name.split(' > ');
    const locationTags = simplifiedAddress.slice(0, 2);

    const createdPlace = await this.placeRepository.saveByKakaoPlace(
      kakaoPlace.documents[0],
    );

    const createdCategoryTags = await this.tagService.createTags(
      categoryTags,
      TagType.OtherCategory,
    ); // 문자열 Array와 타입을 받아서 태그를 생성하고 생성된 태그 Array를 반환
    const createdLocationTags = await this.tagService.createTags(
      locationTags,
      TagType.Location,
    );
    console.log(createdCategoryTags.concat(createdLocationTags));
    for (const tag of createdCategoryTags.concat(createdLocationTags)) {
      {
        await this.createPlaceTag({ placeId: createdPlace.id, tagId: tag.id });
      }
    }
    // 문자열 Array와 타입을 받아서 태그를 생성하고 생성된 태그 Array를 반환
    //생성된 태그들을 createPlaceTag를 통해 연결. 위의 created 두개를 Concat하고
    //반환은 그냥 위치 정보만..
    //트랜잭션으로 처리하기.
    return createdPlace;
    // 카테고리 매핑
    // 카테고리 파싱 및 태그 저장
    // 위치 파싱 및 태그 저장
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

    return placeDetail.data; //axios의 반환값에서 data만을 반환시켜야 한다.
  }

  // deprecated

  // @Transactional()
  // async createPlaceByGooglePlaceId(
  //   googlePlaceId: string,
  // ): Promise<PlaceDetailResDto> {
  //   const existedPlace = await this.placeRepository.findOne({
  //     where: { kakaoId: googlePlaceId },
  //   });
  //   if (existedPlace) return this.getPlaceDetailById(existedPlace.id);
  //   console.log(existedPlace);
  //   const placeDetail = await this.getPlaceDetailByGooglePlaceId(googlePlaceId);
  //   console.log(placeDetail);
  //   const createdPlace =
  //     await this.placeRepository.saveByGooglePlaceDetail(placeDetail);
  //   console.log(createdPlace);
  //   // if (placeDetail.regularOpeningHours) {
  //   //   OpenHours = await this.openHoursRepository.save({
  //   //     opening: placeDetail.regularOpeningHours.weekdayDescriptions,
  //   //     place: createdPlace,
  //   //   });
  //   // }

  //   // if (placeDetail.addressComponents) {
  //   //   await this.addressComponentsRepository.saveAddressComponents(
  //   //     placeDetail.addressComponents,
  //   //     createdPlace,
  //   //   );
  //   // }

  //   const createdPlaceDetail =
  //     await this.placeDetailRepository.saveByPlaceDetailByGoogle(
  //       createdPlace.id,
  //       placeDetail,
  //     );
  //   return PlaceDetailResDto.fromCreation(createdPlace);
  // }

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

  async createPlaceImage(createPlaceImageReqDto: CreatePlaceImageReqDto) {
    const existedRelation = await this.placeImageRepository.findOne({
      where: {
        placeId: createPlaceImageReqDto.placeId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeImageRepository.save(createPlaceImageReqDto);
  }

  async createPlaceByKeyword(keyword: string) {
    const kakaoPlace = await this.searchKakaoPlaceByKeyword(keyword);
    return await this.placeRepository.saveByKakaoPlace(kakaoPlace.documents[0]);
  }
}
