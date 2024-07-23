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
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import {
  CreatePlaceCategoryReqDto,
  CreatePlaceImageReqDto,
  CreatePlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/repositories/place-image.repository';

import { Transactional } from 'typeorm-transactional';
import { UserRepository } from 'src/repositories/user.repository';
import { MarkerResDto } from './dtos/marker-res.dto';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceListReqDto } from './dtos/place-list-pagination-req.dto';
import {
  PlaceListDataDto,
  PlaceListResDto,
} from './dtos/place-list-pagination-res.dto';
import { PlaceDetailByGoogle } from 'src/common/interfaces/place-detail-google.interface';
import { PlaceDetailRepository } from 'src/repositories/place-detail.repository';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly userRepository: UserRepository,
    private readonly placeDetailRepository: PlaceDetailRepository,
  ) {}

  async getPlaceDetailById(placeId: number): Promise<PlaceDetailResDto> {
    const place = await this.placeRepository.getPlaceDetailById(placeId);
    if (!place) throw new NotFoundException('Place not found');
    return new PlaceDetailResDto(place);
  }

  async searchKakaoPlaceByKeyword(keyword: string): Promise<any> {
    const response = await axios.get(SEARCH_BY_KEYWORD_KAKAO_URL, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      params: { query: keyword, size: 3 },
    });
    return response.data;
  }

  async createPlaceByKakao(keyword: string) {
    const kakaoPlace = await this.searchKakaoPlaceByKeyword(keyword);
    return this.placeRepository.saveByKakaoPlace(kakaoPlace.documents[0]);
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

  @Transactional()
  async createPlaceByGooglePlaceId(
    googlePlaceId: string,
  ): Promise<PlaceDetailResDto> {
    const existedPlace = await this.placeRepository.findOne({
      where: { kakaoId: googlePlaceId },
    });
    if (existedPlace) return this.getPlaceDetailById(existedPlace.id);
    console.log(existedPlace);
    const placeDetail = await this.getPlaceDetailByGooglePlaceId(googlePlaceId);
    console.log(placeDetail);
    const createdPlace =
      await this.placeRepository.saveByGooglePlaceDetail(placeDetail);
    console.log(createdPlace);
    // if (placeDetail.regularOpeningHours) {
    //   OpenHours = await this.openHoursRepository.save({
    //     opening: placeDetail.regularOpeningHours.weekdayDescriptions,
    //     place: createdPlace,
    //   });
    // }

    // if (placeDetail.addressComponents) {
    //   await this.addressComponentsRepository.saveAddressComponents(
    //     placeDetail.addressComponents,
    //     createdPlace,
    //   );
    // }

    const createdPlaceDetail =
      await this.placeDetailRepository.saveByPlaceDetailByGoogle(
        createdPlace.id,
        placeDetail,
      );
    return PlaceDetailResDto.fromCreation(createdPlace);
  }

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

  async getMarkers(
    userId: number,
    addressCollection: string[],
    categoryCollection: string[],
    folderId?: number,
  ): Promise<MarkerResDto[]> {
    //입력값이 문자열 1개라 배열이 아닐 때 수동으로 배열로 바꿔줘야 함.
    addressCollection =
      typeof addressCollection === 'string'
        ? [addressCollection]
        : addressCollection;

    categoryCollection =
      typeof categoryCollection === 'string'
        ? [categoryCollection]
        : categoryCollection;

    if (folderId !== undefined) {
      return await this.userRepository.getMarkers(
        userId,
        addressCollection,
        categoryCollection,
        folderId,
      );
    }
    return await this.userRepository.getMarkers(
      userId,
      addressCollection,
      categoryCollection,
    );
  }

  async getPlaceInfoFromMarker(placeId: number): Promise<PlacePreviewResDto> {
    return new PlacePreviewResDto(
      await this.placeRepository.getPlaceInfoFromMarker(placeId),
    );
  }

  async getPlaceList(
    userId: number,
    placeListReqDto: PlaceListReqDto,
    folderId?: number,
  ): Promise<PlaceListResDto> {
    placeListReqDto.addressCollection =
      typeof placeListReqDto.addressCollection === 'string'
        ? [placeListReqDto.addressCollection]
        : placeListReqDto.addressCollection;

    placeListReqDto.categoryCollection =
      typeof placeListReqDto.categoryCollection === 'string'
        ? [placeListReqDto.categoryCollection]
        : placeListReqDto.categoryCollection;

    let placeCollection: PlaceListDataDto[];
    if (folderId !== undefined) {
      placeCollection = await this.userRepository.getPlaceList(
        userId,
        placeListReqDto,
        folderId,
      );
    } else {
      placeCollection = await this.userRepository.getPlaceList(
        userId,
        placeListReqDto,
      );
    }

    //주소 형태 변환
    placeCollection.map((place) => {
      const shortAddress = place.address.split(' ');
      place.address = shortAddress.slice(0, 2).join(' ');
    });

    let hasNext: boolean;
    let nextCursorId: number = null;

    if (!placeListReqDto.cursorId) {
      console.log(placeCollection.length);
      hasNext = placeCollection.length > placeListReqDto.take * 2;
    } else {
      hasNext = placeCollection.length > placeListReqDto.take;
    }

    if (!hasNext) {
      nextCursorId = null;
    } else {
      nextCursorId = placeCollection[placeCollection.length - 2].id;
      placeCollection.pop();
    }

    const placeListResCollection = new PlaceListResDto(placeCollection, {
      take: placeListReqDto.take,
      hasNext: hasNext,
      cursorId: nextCursorId,
    });

    return placeListResCollection;
  }
  async createPlaceByKeyword(keyword: string) {
    const kakaoPlace = await this.searchKakaoPlaceByKeyword(keyword);
    return kakaoPlace.documents[0];
  }
}
