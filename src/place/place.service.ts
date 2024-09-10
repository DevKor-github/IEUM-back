import { placeDetailsForTransferring } from './../common/interfaces/google-places-api.interface';
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
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { TagService } from 'src/tag/tag.service';
import { TagType } from 'src/common/enums/tag-type.enum';
import { S3Service } from 'src/place/s3.service';
import { PlaceTagRepository } from './repositories/place-tag.repository';
import { PlaceDetailRepository } from './repositories/place-detail.repository';
import { CreatePlaceTagReqDto } from './dtos/create-place-tag-req.dto';
import { Place } from './entities/place.entity';
import { throwIeumException } from 'src/common/utils/exception.util';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { GooglePlacesApiPlaceDetailsRes } from 'src/common/interfaces/google-places-api.interface';
import { CollectionService } from 'src/collection/collection.service';
import { RawLinkedColletion } from 'src/common/interfaces/raw-linked-collection.interface';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeTagRepository: PlaceTagRepository,
    private readonly placeImageRepository: PlaceImageRepository,
    private readonly placeDetailRepository: PlaceDetailRepository,
    private readonly collectionService: CollectionService,
    private readonly tagService: TagService,
    private readonly s3Service: S3Service,
  ) {}

  // ---------외부 API 검색 - 카카오 ---------

  async searchKakaoLocalByKeyword(keyword: string): Promise<any> {
    const response = await axios.get(SEARCH_BY_KEYWORD_KAKAO_URL, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      params: { query: keyword, size: 3 },
    });
    const kakaoPlace = response.data;
    return kakaoPlace;
  }

  // ---------외부 API 검색 - Google ---------
  async getGooglePlacesApiByText(text: string): Promise<any> {
    const place = await axios.post(
      SEARCH_BY_TEXT_URL,
      { textQuery: text, languageCode: 'ko' },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.name,places.displayName',
        },
      },
    );
    return place.data;
  }

  async getGooglePlacesApiPlaceDetailsById(
    googlePlaceId: string,
  ): Promise<GooglePlacesApiPlaceDetailsRes> {
    const placeDetail = await axios.get(SEARCH_BY_ID_URL + googlePlaceId, {
      params: { languageCode: 'ko' },
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'id,name,displayName,googleMapsUri,photos,regularOpeningHours.weekdayDescriptions,parkingOptions,allowsDogs,goodForGroups,takeout,delivery,reservable',
      },
    });
    return placeDetail.data;
  }

  async getGooglePlacesApiPhotoByResourceName(resourceName: string) {
    const placePhoto: any = await axios.get(
      `https://places.googleapis.com/v1/${resourceName}/media`,
      {
        params: {
          key: process.env.GOOGLE_API_KEY,
          maxHeightPx: 1000,
          skipHttpRedirect: true,
        },
      },
    );

    return placePhoto.data;
  }
  // --------- 주요 메서드 ---------
  @Transactional()
  async createPlaceDetailByGooglePlacesApi(placeId: number) {
    //DB 내부의 장소 Entity 가져오기
    const place = await this.placeRepository.findOne({
      where: { id: placeId },
    });
    if (!place) {
      throwIeumException('PLACE_NOT_FOUND');
    }

    //Text Search를 위한 키워드 생성
    const simplifiedAddress = addressSimplifier(place.address);
    const placeName = place.name;

    //Text Search. 결과가 없을 경우 에러 핸들링 필요
    const googlePlacesApiTextSearchResult = await this.getGooglePlacesApiByText(
      `${simplifiedAddress} ${placeName}`,
    );
    //

    //Text Search 결과로부터 GET PlaceDetails
    const googlePlacesApiPlaceDetailsResult: GooglePlacesApiPlaceDetailsRes =
      await this.getGooglePlacesApiPlaceDetailsById(
        googlePlacesApiTextSearchResult.places[0].id,
      );

    //내부 PlaceDetail 생성을 위한 인터페이스 파싱 및 DB 저장
    const placeDetailsForTransferring = this.extractPlaceDetailsForTransferring(
      googlePlacesApiPlaceDetailsResult,
    );
    await this.placeDetailRepository.createPlaceDetailByGoogle(
      place,
      placeDetailsForTransferring,
    );
    //Google Places Api에서 장소 사진 가져와서 S3 업로드, 내부 DB에 릴레이션 형성
    await this.createPlaceImageByGooglePlacesApiPlaceDetailsRes(
      placeId,
      googlePlacesApiPlaceDetailsResult,
    );

    return { message: 'success' };
  }

  async uploadImageToS3ByUri(photoUri: string) {
    return await this.s3Service.getAndUploadFromUri(photoUri);
  }

  @Transactional()
  async createPlaceImageByGooglePlacesApiPlaceDetailsRes(
    placeId: number,
    googlePlacesApiPlaceDetailsRes: GooglePlacesApiPlaceDetailsRes,
  ) {
    const resourceName = googlePlacesApiPlaceDetailsRes.photos[0].name;
    const authorName =
      googlePlacesApiPlaceDetailsRes.photos[0].authorAttributions[0]
        .displayName;
    const authorUri =
      googlePlacesApiPlaceDetailsRes.photos[0].authorAttributions[0].uri;

    const googlePlacesApiPhotoRes =
      await this.getGooglePlacesApiPhotoByResourceName(resourceName);

    const sourcePhotoUri = googlePlacesApiPhotoRes.photoUri;
    const uploadedImageUri = await this.uploadImageToS3ByUri(sourcePhotoUri);
    const placeImage = await this.placeImageRepository.createPlaceImageByGoogle(
      placeId,
      uploadedImageUri,
      authorName,
      authorUri,
    );

    return placeImage;
  }

  // ---------내부 DB 검색---------
  async getPlaceDetailById(
    userId: number,
    placeId: number,
  ): Promise<PlaceDetailResDto> {
    const place = await this.placeRepository.getPlaceDetailById(placeId);
    if (!place) {
      throwIeumException('PLACE_NOT_FOUND');
    }

    const placeDetail = await this.placeRepository.getPlaceDetailById(placeId);
    const placeImages =
      await this.placeImageRepository.getPlaceImagesByPlaceId(placeId);
    const linkedCollections: RawLinkedColletion[] =
      await this.collectionService.getLinkedCollections(userId, placeId);
    return new PlaceDetailResDto(placeDetail, placeImages, linkedCollections);
    /*
    const placeDetail = place와 placeDetail JOIN
    - Place, PlaceDetail JOIN
    - Place, PlaceDetail을 JOIN, placeDetail로 WHERE 걸어서 필요한 정보들을 Serving
    const placeImages = placeId로 WHERE 걸어서 Serving
    const linkedCollections = placeId, userId 사용
    - 먼저 Collection에서 userId로 WHERE LIKE로 서브쿼리
    - Collection과 CollectionPlace JOIN, placeId로 WHERE
    - id, link, content, collectionType, updatedAt SELECT
    */
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

  // ---------크롤링 장소 처리---------

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
  // ------ 캡슐화
  extractPlaceDetailsForTransferring(
    googlePlacesApiPlaceDetailsResult: GooglePlacesApiPlaceDetailsRes,
  ) {
    const placeDetailsForTransferring: placeDetailsForTransferring = {
      weekDaysOpeningHours:
        googlePlacesApiPlaceDetailsResult.regularOpeningHours
          .weekdayDescriptions ?? null,
      freeParkingLot:
        googlePlacesApiPlaceDetailsResult.parkingOptions?.freeParkingLot ??
        null,
      paidParkingLot:
        googlePlacesApiPlaceDetailsResult.parkingOptions?.paidParkingLot ??
        null,
      freeStreetParking:
        googlePlacesApiPlaceDetailsResult.parkingOptions?.freeStreetParking ??
        null,
      allowsDogs: googlePlacesApiPlaceDetailsResult.allowsDogs ?? null,
      goodForGroups: googlePlacesApiPlaceDetailsResult.goodForGroups ?? null,
      takeout: googlePlacesApiPlaceDetailsResult.takeout ?? null,
      delivery: googlePlacesApiPlaceDetailsResult.delivery ?? null,
      reservable: googlePlacesApiPlaceDetailsResult.reservable ?? null,
      googleMapsUri: googlePlacesApiPlaceDetailsResult.googleMapsUri ?? null,
    };
    return placeDetailsForTransferring;
  }
}
