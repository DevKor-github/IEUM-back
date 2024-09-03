import { MethodNames } from 'src/common/types/method-names.type';
import { FolderService } from './folder.service';
import { UseGuards } from '@nestjs/common';
import { NicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
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
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOperation({
      summary:
        '유저의 폴더 리스트 가져오기. type 0 = Default, type 1= Insta, type 2 = Custom',
    }),
    ApiOkResponse({ type: FoldersListResDto }),
  ],
  createNewFolder: [
    ApiIeumExceptionRes(['USERINFO_FILL_REQUIRED']),
    ApiCreatedResponse({
      description: '폴더 생성 성공',
    }),
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
  ],
  deleteFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiIeumExceptionRes(['FORBIDDEN_FOLDER']),
    ApiBearerAuth('Access Token'),
    ApiCreatedResponse({
      description: '폴더 삭제 성공',
    }),
    ApiOperation({ summary: '존재하는 폴더 삭제하기' }),
  ],
  changeFolderName: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({
      description: '폴더 이름 변경 성공',
    }),
    ApiOperation({ summary: '폴더 이름 변경하기' }),
    ApiIeumExceptionRes(['FORBIDDEN_FOLDER']),
  ],
  deleteFolderPlaces: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({
      description: '폴더에서 장소 삭제 성공.',
    }),
    ApiOperation({ summary: '폴더에서 장소 삭제하기' }),
    ApiIeumExceptionRes(['FORBIDDEN_FOLDER']),
  ],
  getDefaultFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
  ],
  getAllMarkers: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({ type: MarkersListResDto }),
  ],
  getMarkersByFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({ type: MarkersListResDto }),
  ],
  getAllPlacesList: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({ type: PlacesListResDto }),
  ],
  getPlaceListByFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiOkResponse({ type: PlacesListResDto }),
  ],
  createFolderPlacesIntoDefaultFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiCreatedResponse({
      description: '디폴트 폴더에 장소 추가 성공',
    }),
  ],
  createFolderPlacesIntoFolder: [
    UseGuards(NicknameCheckingAccessGuard),
    ApiBearerAuth('Access Token'),
    ApiCreatedResponse({
      description: '특정 폴더에 장소 추가 성공',
    }),
  ],
};
