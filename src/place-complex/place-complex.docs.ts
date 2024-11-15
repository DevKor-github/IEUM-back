import { MethodNames } from 'src/common/types/method-names.type';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { PlaceDetailResDto } from 'src/place/dtos/place-detail-res.dto';
import { PlaceComplexController } from './place-complex.controller';
import { FoldersWithPlaceExistenceListResDto } from 'src/folder/dtos/folders-list.res.dto';

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
  getFoldersListWithPlaceExistence: [
    ApiOperation({
      summary:
        '특정 장소를 포함하고 있는지의 여부를 담은 폴더 리스트를 조회합니다.',
      description:
        '특정 장소를 포함하고 있는지의 여부를 담은 폴더 리스트를 조회합니다.',
    }),
    ApiOkResponse({
      description: '폴더 리스트 조회 성공',
      type: [FoldersWithPlaceExistenceListResDto],
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
  getRelatedCollectionsFromOthersByPlaceId: [
    ApiOperation({
      summary: '특정 장소에 대한 다른 사용자의 컬렉션 조회',
      description: '특정 장소에 대한 다른 사용자의 컬렉션 조회',
    }),
    ApiOkResponse({
      description: '컬렉션 조회 성공',
      type: [FoldersWithPlaceExistenceListResDto],
    }),
    ApiIeumExceptionRes(['PLACE_NOT_FOUND']),
  ],
};
