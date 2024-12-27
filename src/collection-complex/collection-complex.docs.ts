import { MethodNames } from 'src/common/types/method-names.type';
import { CollectionComplexController } from './collection-complex.controller';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CollectionPlacesListResDto } from 'src/collection/dtos/collection-places-list-res.dto';
import { CollectionsListResDto } from 'src/collection/dtos/paginated-collections-list-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';

type CollectionComplexMethodName = MethodNames<CollectionComplexController>;

export const CollectionComplexDocs: Record<
  CollectionComplexMethodName,
  MethodDecorator[]
> = {
  getViewedCollections: [
    ApiOperation({ summary: '이미 조회한 게시글 조회' }),
    ApiOkResponse({
      description: '게시글 조회 성공',
      type: CollectionsListResDto,
    }),
    ApiQuery({ name: 'cursorId', required: false }),
  ],
  getCollectionPlaces: [
    ApiOperation({ summary: '특정 게시글의 장소 후보 리스트 조회' }),
    ApiOkResponse({
      description: '장소 후보 리스트 조회 성공',
      type: CollectionPlacesListResDto,
    }),
    ApiIeumExceptionRes(['COLLECTION_NOT_FOUND']),
  ],
};
