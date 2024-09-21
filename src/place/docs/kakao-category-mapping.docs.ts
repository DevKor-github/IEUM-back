import { MethodNames } from 'src/common/types/method-names.type';
import { KakaoCategoryMappingController } from '../controllers/kakao-category-mapping.controller';
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
    ApiOperation({
      summary: '카카오 카테고리 매핑 생성',
      description: `어떤 카카오 카테고리를 특정 IeumCategory와 매핑시킬 수 있습니다.
      IeumCategory는 앱 내에서 카테고리 필터링, 마커 등에 사용되는 이음 고유의 Category입니다.
      FOOD | CAFE | ALCOHOL | MUSEUM | SHOPPING | STAY 가 존재합니다.
      카카오 카테고리는 특정 장소의 상세 정보에 들어가면 확인할 수 있는 카테고리(primaryCategory)에 해당합니다.
      아직 매핑이 형성되지 않은 카카오 카테고리의 경우, OTHERS로 매핑되도록 설정되어 있습니다.`,
    }),
    ApiCreatedResponse({ description: '카카오 카테고리 매핑 생성 성공' }),
  ],
  updateKakaoCategoryMapping: [
    ApiOperation({
      summary: '카카오 카테고리 매핑 수정',
      description: `어떤 카카오 카테고리를 특정 IeumCategory와 매핑시킬 수 있습니다.
      IeumCategory는 앱 내에서 카테고리 필터링, 마커 등에 사용되는 이음 고유의 Category입니다.
      FOOD | CAFE | ALCOHOL | MUSEUM | SHOPPING | STAY 가 존재합니다.
      카카오 카테고리는 특정 장소의 상세 정보에 들어가면 확인할 수 있는 카테고리(primaryCategory)에 해당합니다.
      아직 매핑이 형성되지 않은 카카오 카테고리의 경우, OTHERS로 매핑되도록 설정되어 있습니다.`,
    }),
    ApiOkResponse({ description: '카카오 카테고리 매핑 수정 성공' }),
  ],
  deleteKakaoCateogryMapping: [
    ApiOperation({ summary: '카카오 카테고리 매핑 삭제' }),
    ApiNoContentResponse({ description: '카카오 카테고리 매핑 삭제 성공' }),
  ],
};
