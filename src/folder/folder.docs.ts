import { MethodNames } from 'src/common/types/method-names.type';
import { FolderService } from './folder.service';
import { UseGuards } from '@nestjs/common';
import {
  NicknameCheckingAccessGuard,
  UseNicknameCheckingAccessGuard,
} from 'src/auth/guards/nickname-check-access.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FoldersListResDto } from './dtos/folders-list.res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { MarkersListResDto } from 'src/place/dtos/markers-list-res.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import { FolderController } from './folder.controller';

type FolderMethodName = MethodNames<FolderController>;

export const FolderDocs: Record<FolderMethodName, MethodDecorator[]> = {
  getFoldersList: [
    ApiOperation({
      summary:
        '유저의 폴더 리스트 가져오기. type 0 = Default, type 1= Insta, type 2 = Custom',
    }),
    ApiOkResponse({ type: FoldersListResDto }),
  ],
  createNewFolder: [
    ApiOperation({ summary: '새로운 폴더 생성하기' }),
    ApiCreatedResponse({
      description: '폴더 생성 성공',
    }),
    ApiIeumExceptionRes(['USERINFO_FILL_REQUIRED']),
  ],
  changeFolderName: [
    ApiOperation({ summary: '폴더 이름 변경하기' }),
    ApiOkResponse({
      description: '폴더 이름 변경 성공',
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  deleteFolder: [
    ApiOperation({ summary: '특정 폴더 삭제하기' }),
    ApiCreatedResponse({
      description: '폴더 삭제 성공',
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],

  deleteFolderPlaces: [
    ApiOperation({
      summary: '디폴트 폴더에서 장소 삭제하기(모든 폴더에서 삭제하기)',
    }),
    ApiOkResponse({
      description: '디폴트 폴더에서 장소 삭제 성공.',
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  getDefaultFolder: [
    ApiOperation({ summary: '로그인한 유저의 디폴트 폴더 가져오기' }),
    ApiOkResponse({ description: '성공' }),
  ],
  getAllMarkers: [
    ApiOperation({ summary: '저장한 모든 장소의 마커 리스트 가져오기' }),
    ApiOkResponse({ description: '성공', type: MarkersListResDto }),
  ],
  getMarkersByFolder: [
    ApiOperation({ summary: '특정 폴더의 장소 마커 리스트 가져오기' }),
    ApiOkResponse({ description: '성공', type: MarkersListResDto }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  getAllPlacesList: [
    ApiOperation({ summary: '저장한 모든 장소 리스트 가져오기' }),
    ApiOkResponse({ description: '성공', type: PlacesListResDto }),
  ],
  getPlaceListByFolder: [
    ApiOperation({ summary: '특정 폴더의 장소 리스트 가져오기' }),
    ApiOkResponse({ description: '성공', type: PlacesListResDto }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  createFolderPlacesIntoDefaultFolder: [
    ApiOperation({ summary: '디폴트 폴더에 장소 추가하기' }),
    ApiCreatedResponse({
      description: '디폴트 폴더에 장소 추가 성공',
    }),
  ],
  createFolderPlacesIntoFolder: [
    ApiOperation({ summary: '특정 폴더에 장소 추가하기' }),
    ApiCreatedResponse({
      description: '특정 폴더에 장소 추가 성공',
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
};
