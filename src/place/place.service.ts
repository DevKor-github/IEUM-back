import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import {
  PLACES_API_BASE_URL,
  SEARCH_BY_ID_URL,
  SEARCH_BY_TEXT_URL,
} from 'src/common/constants/google-apis.constant';
import { Place } from 'src/entities/place.entity';
import { CategoryRepository } from 'src/repositories/category.repository';
import { OpenHoursRepository } from 'src/repositories/open-hours.repository';
import { PlaceCategoryRepository } from 'src/repositories/place-category.repository';
import { PlaceRepository } from 'src/repositories/place.repository';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import {
  CreatePlaceCategoryReqDto,
  createPlaceImageReqDto,
  createPlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/repositories/place-image.repository';
import { AddressComponents } from 'src/entities/address-components.entity';
import { AddressComponentsRepository } from 'src/repositories/address-components.repository';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly openHoursRepository: OpenHoursRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly placeCategoryRepository: PlaceCategoryRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly addressComponentsRepository: AddressComponentsRepository,
  ) {}

  async getPlaceDetailById(placeId: number): Promise<PlaceDetailResDto> {
    const place = await this.placeRepository.getPlaceDetailById(placeId);
    if (!place) throw new NotFoundException('Place not found');
    return new PlaceDetailResDto(place);
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
    //return this.getPlaceDetailById(place.data.places[0].id);
  }

  async getPlaceDetailByGooglePlaceId(googlePlaceId: string): Promise<any> {
    const placeDetail = await axios.get(SEARCH_BY_ID_URL + googlePlaceId, {
      params: { languageCode: 'ko' },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'id,name,types,displayName,nationalPhoneNumber,formattedAddress,location,regularOpeningHours.weekdayDescriptions,displayName,primaryTypeDisplayName,addressComponents',
      },
    });

    return placeDetail.data;

    /*return {
      장소명: placeDetail.data.displayName.text,
      주소: placeDetail.data.formattedAddress,
      위도: placeDetail.data.location.latitude,
      경도: placeDetail.data.location.longitude,
      전화번호: placeDetail.data.nationalPhoneNumber,
      영업시간: placeDetail.data.regularOpeningHours.weekdayDescriptions,
      카테고리: placeDetail.data.primaryTypeDisplayName.text,
      '기타 태그': placeDetail.data.types,
    };*/
  }

  async createPlaceByGooglePlaceId(
    googlePlaceId: string,
  ): Promise<PlaceDetailResDto> {
    const existedPlace = await this.placeRepository.findOne({
      where: { googlePlaceId: googlePlaceId },
    });
    if (existedPlace) return this.getPlaceDetailById(existedPlace.id);

    const placeDetail = await axios.get(SEARCH_BY_ID_URL + googlePlaceId, {
      params: { languageCode: 'ko' },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'id,name,types,displayName,nationalPhoneNumber,formattedAddress,location,regularOpeningHours.weekdayDescriptions,displayName,primaryTypeDisplayName',
      }, // photos
    });

    const createdPlace =
      await this.placeRepository.saveByGooglePlaceDetail(placeDetail);

    const OpenHours = await this.openHoursRepository.save({
      opening: placeDetail.data.regularOpeningHours.weekdayDescriptions,
      place: createdPlace,
    });

    const addressComponents =
      await this.addressComponentsRepository.saveAddressComponents(
        placeDetail.data.addressComponents,
        createdPlace,
      );

    let existedCategory = await this.categoryRepository.findOne({
      where: {
        categoryName: placeDetail.data.primaryTypeDisplayName.text,
      },
    });
    if (!existedCategory) {
      existedCategory = await this.categoryRepository.save({
        categoryName: placeDetail.data.primaryTypeDisplayName.text,
      });
    }
    console.log(existedCategory);

    await this.placeCategoryRepository.save({
      place: createdPlace,
      category: existedCategory,
    });

    return PlaceDetailResDto.fromCreation(
      createdPlace,
      OpenHours,
      existedCategory,
    );
  }

  //Place 부가정보 relation 저장
  async createPlaceCategory(
    createPlaceCategoryReqDto: CreatePlaceCategoryReqDto,
  ) {
    const existedRelation = await this.placeCategoryRepository.findOne({
      where: {
        placeId: createPlaceCategoryReqDto.placeId,
        categoryId: createPlaceCategoryReqDto.categoryId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeCategoryRepository.save(createPlaceCategoryReqDto);
  }

  async createPlaceTag(createPlaceTagReqDto: createPlaceTagReqDto) {
    const existedRelation = await this.placeTagRepository.findOne({
      where: {
        placeId: createPlaceTagReqDto.placeId,
        tagId: createPlaceTagReqDto.tagId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeTagRepository.save(createPlaceTagReqDto);
  }

  async createPlaceImage(createPlaceImageReqDto: createPlaceImageReqDto) {
    const existedRelation = await this.placeImageRepository.findOne({
      where: {
        placeId: createPlaceImageReqDto.placeId,
        imageId: createPlaceImageReqDto.imageId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeImageRepository.save(createPlaceImageReqDto);
  }
}
