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
  CreatePlaceImageReqDto,
  CreatePlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/repositories/place-image.repository';
import { AddressComponents } from 'src/entities/address-components.entity';
import { AddressComponentsRepository } from 'src/repositories/address-components.repository';
import { Transactional } from 'typeorm-transactional';
import { Category } from 'src/entities/category.entity';
import { OpenHours } from 'src/entities/open-hours.entity';
import { PlaceDetailByGoogle } from 'src/common/interfaces/place-detail-google.interface';
import { PlaceDetailRepository } from 'src/repositories/place-detail.repository';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly openHoursRepository: OpenHoursRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly placeCategoryRepository: PlaceCategoryRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly placeDetailRepository: PlaceDetailRepository,
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
      where: { googlePlaceId: googlePlaceId },
    });
    if (existedPlace) return this.getPlaceDetailById(existedPlace.id);
    console.log(existedPlace);
    const placeDetail = await this.getPlaceDetailByGooglePlaceId(googlePlaceId);
    console.log(placeDetail);
    const createdPlace =
      await this.placeRepository.saveByGooglePlaceDetail(placeDetail);
    console.log(createdPlace);
    let OpenHours: OpenHours;
    if (placeDetail.regularOpeningHours) {
      OpenHours = await this.openHoursRepository.save({
        opening: placeDetail.regularOpeningHours.weekdayDescriptions,
        place: createdPlace,
      });
    }

    if (placeDetail.addressComponents) {
      await this.addressComponentsRepository.saveAddressComponents(
        placeDetail.addressComponents,
        createdPlace,
      );
    }
    const categories = await this.categoryRepository.saveCategoryArray(
      placeDetail.types,
    );

    await this.placeCategoryRepository.savePlaceCategoryArray(
      createdPlace,
      categories,
    );

    const createdPlaceDetail =
      await this.placeDetailRepository.saveByPlaceDetailByGoogle(
        createdPlace.id,
        placeDetail,
      );
    return PlaceDetailResDto.fromCreation(createdPlace, OpenHours, categories);
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
        imageId: createPlaceImageReqDto.imageId,
      },
    });
    if (existedRelation) return existedRelation;
    return await this.placeImageRepository.save(createPlaceImageReqDto);
  }
}
