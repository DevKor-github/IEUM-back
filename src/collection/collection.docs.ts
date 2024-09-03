import { MethodNames } from 'src/common/types/method-names.type';
import { CollectionController } from './collection.controller';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/auth/guards/access.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';

type CollectionMethodName = MethodNames<CollectionController>;

export const CollectionDocs: Record<CollectionMethodName, MethodDecorator[]> = {
  getUnviewedCollections: [
    UseGuards(AccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: '조회하지 않은 게시글 조회' }),
    ApiOkResponse({
      description: '게시글 조회 성공',
      type: CollectionsListResDto,
    }),
    ApiQuery({ name: 'cursorId', required: false }),
  ],
  getViewedCollection: [
    UseGuards(AccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: '이미 조회한 게시글 조회' }),
    ApiOkResponse({
      description: '게시글 조회 성공',
      type: CollectionsListResDto,
    }),
    ApiQuery({ name: 'cursorId', required: false }),
  ],
  getCollectionPlaces: [
    UseGuards(AccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({ summary: '특정 게시글의 장소 후보 리스트 조회' }),
    ApiOkResponse({
      description: '장소 후보 리스트 조회 성공',
      type: CollectionPlacesListResDto,
    }),
  ],
};
