import { MethodNames } from 'src/common/types/method-names.type';
import { KakaoCategoryMappingController } from './kakao-category-mapping.controller';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

type KakaoCategoryMappingMethodName =
  MethodNames<KakaoCategoryMappingController>;

export const KakaoCategoryMappingDocs: Record<
  KakaoCategoryMappingMethodName,
  MethodDecorator[]
> = {
  getIeumCategoryByKakaoCategory: [
    ApiOperation({ summary: '카카오 카테고리로 이음 카테고리 조회' }),
    ApiOkResponse({ description: '이음 카테고리 조회 성공' }),
  ],
  createKakaoCategoryMapping: [
    ApiOperation({ summary: '카카오 카테고리 매핑 생성' }),
    ApiCreatedResponse({ description: '카카오 카테고리 매핑 생성 성공' }),
  ],
  updateKakaoCategoryMapping: [
    ApiOperation({ summary: '카카오 카테고리 매핑 수정' }),
    ApiOkResponse({ description: '카카오 카테고리 매핑 수정 성공' }),
  ],
  deleteKakaoCateogryMapping: [
    ApiOperation({ summary: '카카오 카테고리 매핑 삭제' }),
    ApiNoContentResponse({ description: '카카오 카테고리 매핑 삭제 성공' }),
  ],
};
