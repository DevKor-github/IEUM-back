import { MethodNames } from 'src/common/types/method-names.type';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  FolderResDto,
  FoldersListResDto,
  FoldersWithThumbnailListResDto,
} from './dtos/folders-list.res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { MarkersListResDto } from 'src/place/dtos/markers-list-res.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import { FolderController } from './folder.controller';
import { CreateFolderPlaceResDto } from './dtos/create-folder-place-res.dto';
import { Folder } from './entities/folder.entity';

type FolderMethodName = MethodNames<FolderController>;

export const FolderDocs: Record<FolderMethodName, MethodDecorator[]> = {
  getFoldersWithThumbnailList: [
    ApiOperation({
      summary:
        '유저의 폴더 리스트 가져오기. type 0 = Default, type 1= Insta, type 2 = Custom',
      description:
        '유저의 폴더 리스트를 가져옵니다. 디폴트 폴더를 제외한 나머지 폴더들을 가져옵니다. (내 보관함). 썸네일을 같이 가져옵니다',
    }),
    ApiOkResponse({ type: FoldersWithThumbnailListResDto }),
  ],
  createNewFolder: [
    ApiOperation({ summary: '새로운 폴더 생성하기' }),
    ApiCreatedResponse({
      description: '폴더 생성 성공',
      type: Folder,
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
      summary: '특정 폴더에서 장소 삭제하기',
      description:
        '특정 폴더에서 장소를 삭제합니다. 대상 폴더가 디폴트 폴더라면, 모든 폴더에서 해당 장소들을 삭제합니다',
    }),
    ApiOkResponse({
      description: '폴더에서 장소 삭제 성공.',
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  getDefaultFolder: [
    ApiOperation({
      summary: '디폴트 폴더 가져오기',
      description: '로그인한 유저의 디폴트 폴더를 가져옵니다(저장한 장소)',
    }),
    ApiOkResponse({ description: '성공', type: FolderResDto }),
  ],
  getAllMarkers: [
    ApiOperation({
      summary: '저장한 모든 장소의 마커 리스트 가져오기',
      description: `저장한 모든 장소, 즉 Default Folder에 담겨있는 마커 리스트를 가져옵니다.
      이음 앱 내에서 사용되는 카테고리인 IeumCategory(FOOD, CAFE, ALCOHOL, MUSEUM, SHOPPING, STAY)에 따라 마커를 필터링하여 가져올 수 있습니다.
      또한 지역별(서울, 경기, 충북, 충남..)로 마커를 필터링하여 가져올 수 있습니다.`,
    }),
    ApiOkResponse({ description: '성공', type: MarkersListResDto }),
  ],
  getMarkersByFolder: [
    ApiOperation({
      summary: '특정 폴더의 장소 마커 리스트 가져오기',
      description: `특정 폴더 내의 장소 마커 리스트를 가져옵니다.
      이음 앱 내에서 사용되는 카테고리인 IeumCategory(FOOD, CAFE, ALCOHOL, MUSEUM, SHOPPING, STAY)에 따라 마커를 필터링하여 가져올 수 있습니다.
      또한 지역별(서울, 경기, 충북, 충남..)로 마커를 필터링하여 가져올 수 있습니다.`,
    }),
    ApiOkResponse({ description: '성공', type: MarkersListResDto }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  getAllPlacesList: [
    ApiOperation({
      summary: '저장한 모든 장소 리스트 가져오기',
      description: `
      저장한 모든 장소, 즉 Default Folder에 담겨있는 장소 리스트를 가져옵니다.
      이음 앱 내에서 사용되는 카테고리인 IeumCategory(FOOD, CAFE, ALCOHOL, MUSEUM, SHOPPING, STAY)에 따라 장소를 필터링하여 가져올 수 있습니다.
      또한 지역별(서울, 경기, 충북, 충남..)로 장소를 필터링하여 가져올 수 있습니다.
      `,
    }),
    ApiOkResponse({ description: '성공', type: PlacesListResDto }),
  ],
  getPlaceListByFolder: [
    ApiOperation({
      summary: '특정 폴더의 장소 리스트 가져오기',
      description: `
      저장한 모든 장소, 즉 Default Folder에 담겨있는 장소 리스트를 가져옵니다.
      이음 앱 내에서 사용되는 카테고리인 IeumCategory(FOOD, CAFE, ALCOHOL, MUSEUM, SHOPPING, STAY)에 따라 장소를 필터링하여 가져올 수 있습니다.
      또한 지역별(서울, 경기, 충북, 충남..)로 장소를 필터링하여 가져올 수 있습니다.
      `,
    }),
    ApiOkResponse({ description: '성공', type: PlacesListResDto }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
  createFolderPlacesIntoDefaultFolder: [
    ApiOperation({
      summary: '디폴트 폴더에 장소 추가하기',
      description: `
      폴더를 지정하지 않고, 디폴트 폴더(저장한 장소)에 장소를 추가합니다.
      해당 장소가 최초로 폴더에 저장된 경우, 장소 상세 정보를 추가적으로 생성합니다.`,
    }),
    ApiCreatedResponse({
      description: '디폴트 폴더에 장소 추가 성공',
      type: CreateFolderPlaceResDto,
    }),
  ],
  createFolderPlacesIntoFolder: [
    ApiOperation({
      summary: '특정 폴더에 장소 추가하기',
      description: `
      특정 폴더에 장소를 추가합니다.
      해당 장소가 최초로 폴더에 저장된 경우, 장소 상세 정보를 추가적으로 생성합니다.`,
    }),
    ApiCreatedResponse({
      description: '특정 폴더에 장소 추가 성공',
      type: CreateFolderPlaceResDto,
    }),
    ApiIeumExceptionRes(['FOLDER_NOT_FOUND', 'FORBIDDEN_FOLDER']),
  ],
};
