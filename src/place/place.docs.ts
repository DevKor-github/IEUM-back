import { MethodNames } from 'src/common/types/method-names.type';
import { PlaceController } from './place.controller';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { NicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceImage } from './entities/place-image.entity';
import { FileInterceptor } from '@nestjs/platform-express';

type PlaceMethodName = MethodNames<PlaceController>;

export const PlaceDocs: Record<PlaceMethodName, MethodDecorator[]> = {
  getPlacesByPlaceName: [
    ApiOperation({ summary: '장소명으로 DB 내의 장소 검색' }),
    ApiQuery({ name: 'placeName', type: 'string' }),
  ],
  getPlaceDetailById: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: '특정 장소의 상세 정보 조회' }),
    ApiOkResponse({
      description: '상세 정보 조회 성공',
      type: PlaceDetailResDto,
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
  getPlacePreviewInfoById: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
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
    ApiOperation({ summary: '장소 이미지 저장' }),
    ApiCreatedResponse({
      description: '장소 이미지 저장 성공',
      type: PlaceImage,
    }),
    ApiIeumExceptionRes([
      'PLACE_NOT_FOUND',
      'BAD_REQUEST_IMAGE_FILE',
      'AWS_S3_ERROR',
    ]),
    UseInterceptors(FileInterceptor('placeImage')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
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
};
