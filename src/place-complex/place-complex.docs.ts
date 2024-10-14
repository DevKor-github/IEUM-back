import { MethodNames } from 'src/common/types/method-names.type';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { PlaceDetailResDto } from 'src/place/dtos/place-detail-res.dto';
import { PlaceComplexController } from './place-complex.controller';

type PlaceComplexMethodName = MethodNames<PlaceComplexController>;

export const PlaceComplexDocs: Record<
  PlaceComplexMethodName,
  MethodDecorator[]
> = {
  getPlaceDetailWithImagesAndCollectionsById: [
    ApiOperation({ summary: '특정 장소의 상세 정보 조회' }),
    ApiOkResponse({
      description: '상세 정보 조회 성공',
      type: PlaceDetailResDto,
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
};
