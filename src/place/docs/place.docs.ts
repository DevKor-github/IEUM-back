import { MethodNames } from 'src/common/types/method-names.type';
import { PlaceController } from '../controllers/place.controller';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PlaceDetailResDto } from '../dtos/place-detail-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { PlacePreviewResDto } from '../dtos/place-preview-res.dto';
import { PlaceImage } from '../entities/place-image.entity';

type PlaceMethodName = MethodNames<PlaceController>;

export const PlaceDocs: Record<PlaceMethodName, MethodDecorator[]> = {
  getPlacesByPlaceName: [
    ApiOperation({ summary: '장소명으로 DB 내의 장소 검색' }),
    ApiQuery({ name: 'placeName', type: 'string' }),
  ],
  getPlaceDetailWithImagesAndCollectionsById: [
    ApiOperation({ summary: '특정 장소의 상세 정보 조회' }),
    ApiOkResponse({
      description: '상세 정보 조회 성공',
      type: PlaceDetailResDto,
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
  getPlacePreviewInfoById: [
    ApiOperation({ summary: '특정 장소의 프리뷰 검색' }),
    ApiOkResponse({
      description: '프리뷰 검색 성공',
      type: PlacePreviewResDto,
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
  getKakaoPlacesByKeyword: [
    ApiOperation({ summary: '키워드로 카카오 Place API 검색' }),
    ApiQuery({ name: 'keyword', type: 'string' }),
  ],
  createPlaceImage: [
    ApiOperation({ summary: '장소 이미지 수동 업로드' }),
    ApiCreatedResponse({
      description: '장소 이미지 저장 성공',
      type: PlaceImage,
    }),
    ApiIeumExceptionRes([
      'PLACE_NOT_FOUND',
      'INVALID_IMAGE_FILE',
      'AWS_S3_INTERNAL_ERROR',
    ]),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        required: ['placeImage'],
        type: 'object',
        properties: {
          placeImage: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  ],
  getGooglePlacesByText: [
    ApiOperation({ summary: '텍스트로 구글 Place API 검색' }),
    ApiQuery({ name: 'text', type: 'string' }),
  ],
  // getGooglePlaceDetailById: [
  //   ApiOperation({ summary: '특정 장소의 구글 Place API 상세 정보 조회' }),
  // ],
  // getGooglePlacePhotoByName: [
  //   ApiOperation({ summary: '이름으로 구글 Place API 사진 검색' }),
  //   ApiQuery({ name: 'name', type: 'string' }),
  // ],
  // uploadImageByUri: [
  //   ApiOperation({ summary: 'URI로 이미지 업로드' }),
  //   ApiCreatedResponse({
  //     description: '이미지 업로드 성공',
  //     type: PlaceImage,
  //   }),
  //   ApiIeumExceptionRes(['IMAGE_DOWNLOAD_FAILED', 'AWS_S3_INTERNAL_ERROR']),
  //   ApiBody({
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         uri: {
  //           type: 'string',
  //         },
  //       },
  //     },
  //   }),
  // ],
  // getGooglePlacesByAutoComplete: [
  //   ApiOperation({ summary: '자동완성 텍스트로 구글 Place API 검색' }),
  //   ApiQuery({ name: 'text', type: 'string' }),
  // ],
  createPlaceDetailByGoogle: [
    ApiOperation({
      summary: '특정 장소의 상세 정보 생성 요청',
      description:
        '특정 장소의 상세 정보를 Google Places API를 통해 생성하도록 요청합니다. PlaceDetail과 PlaceImage가 생성됩니다.',
    }),
    ApiCreatedResponse({
      description:
        '상세 정보 및 이미지 생성 성공. 생성된 placeDetail 엔터티가 리턴됩니다.',
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
};
