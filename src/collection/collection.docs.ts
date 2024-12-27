import { MethodNames } from 'src/common/types/method-names.type';
import { CollectionController } from './collection.controller';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';

type CollectionMethodName = MethodNames<CollectionController>;

export const CollectionDocs: Record<CollectionMethodName, MethodDecorator[]> = {
  getUnviewedCollections: [
    ApiOperation({ summary: '조회하지 않은 게시글 조회' }),
    ApiOkResponse({
      description: '게시글 조회 성공',
      type: CollectionsListResDto,
    }),
    ApiQuery({ name: 'cursorId', required: false }),
  ],
};
