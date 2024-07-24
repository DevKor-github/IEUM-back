import { ForbiddenException, Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderListResDto } from './dtos/folder-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { MarkerResDto } from 'src/place/dtos/marker-res.dto';
import { PlaceListReqDto } from 'src/place/dtos/place-list-req.dto';
import {
  PlaceListDataDto,
  PlaceListResDto,
} from 'src/place/dtos/place-list-res.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFolderList(userId: number): Promise<FolderListResDto[]> {
    const rawFolderList = await this.folderRepository.getFolderList(userId);
    const folderList = rawFolderList.map(
      (folder) => new FolderListResDto(folder),
    );
    return folderList;
  }

  async createNewFolder(
    userId: number,
    createFolderReqDto: CreateFolderReqDto,
  ) {
    return await this.folderRepository.createFolder(
      userId,
      createFolderReqDto.name,
    );
  }

  async deleteFolder(userId: number, folderId: number) {
    const targetFolder =
      await this.folderRepository.findFolderByFolderId(folderId);
    if (targetFolder.userId != userId) {
      throw new ForbiddenException('해당 권한 없음.');
    }
    if (targetFolder.type == FolderType.Default) {
      throw new ForbiddenException('Default 폴더는 삭제할 수 없습니다.');
    }

    return await this.folderRepository.deleteFolder(folderId);
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    return await this.folderRepository.changeFolderName(
      userId,
      folderId,
      folderName,
    );
  }

  async deleteFolderPlace(
    userId: number,
    folderId: number,
    placeIds: number[],
  ) {
    const targetFolder =
      await this.folderRepository.findFolderByFolderId(folderId);

    if (targetFolder.userId != userId) {
      throw new ForbiddenException('해당 권한 없음.');
    }

    if (targetFolder.type == FolderType.Default) {
      return await this.folderPlaceRepository.deleteAllFolderPlace(placeIds);
    }

    return await this.folderPlaceRepository.deleteFolderPlace(
      folderId,
      placeIds,
    );
  }

  async getFolderByFolderId(folderId: number) {}

  async getInstaFolder(userId: number) {
    return await this.folderRepository.getInstaFolder(userId);
  }

  async getDefaultFolder(userId: number) {
    return await this.folderRepository.getDefaultFolder(userId);
  }

  async createFolderPlace(folderId: number, placeId: number) {
    return await this.folderPlaceRepository.createFolderPlace(
      folderId,
      placeId,
    );
  }

  async appendPlaceToInstaFolder(connectedUserId: number, placeId: number) {
    const instaFolder = await this.getInstaFolder(connectedUserId);
    const createdFolderPlace = await this.createFolderPlace(
      instaFolder.id,
      placeId,
    );
    return createdFolderPlace;
  }

  async getMarkers(
    userId: number,
    addressList: string[],
    categoryList: string[],
    folderId?: number,
  ): Promise<MarkerResDto[]> {
    //입력값이 문자열 1개라 배열이 아닐 때 수동으로 배열로 바꿔줘야 함.
    addressList = typeof addressList === 'string' ? [addressList] : addressList;

    categoryList =
      typeof categoryList === 'string' ? [categoryList] : categoryList;

    if (folderId !== undefined) {
      return await this.folderPlaceRepository.getMarkers(
        userId,
        addressList,
        categoryList,
        folderId,
      );
    }
    return await this.folderPlaceRepository.getMarkers(
      userId,
      addressList,
      categoryList,
    );
  }

  async getPlaceList(
    userId: number,
    placeListReqDto: PlaceListReqDto,
    folderId?: number,
  ): Promise<PlaceListResDto> {
    placeListReqDto.addressList =
      typeof placeListReqDto.addressList === 'string'
        ? [placeListReqDto.addressList]
        : placeListReqDto.addressList;

    placeListReqDto.categoryList =
      typeof placeListReqDto.categoryList === 'string'
        ? [placeListReqDto.categoryList]
        : placeListReqDto.categoryList;

    let placeCollection: PlaceListDataDto[];
    if (folderId !== undefined) {
      placeCollection = await this.folderPlaceRepository.getPlaceList(
        userId,
        placeListReqDto,
        folderId,
      );
    } else {
      placeCollection = await this.folderPlaceRepository.getPlaceList(
        userId,
        placeListReqDto,
      );
    }

    //주소 형태 변환
    placeCollection.map((place) => {
      const shortAddress = place.address.split(' ');
      place.address = shortAddress.slice(0, 2).join(' ');
    });

    let hasNext: boolean;
    let nextCursorId: number = null;

    if (!placeListReqDto.cursorId) {
      console.log(placeCollection.length);
      hasNext = placeCollection.length > placeListReqDto.take * 2;
    } else {
      hasNext = placeCollection.length > placeListReqDto.take;
    }

    if (!hasNext) {
      nextCursorId = null;
    } else {
      nextCursorId = placeCollection[placeCollection.length - 2].id;
      placeCollection.pop();
    }

    const placeListResCollection = new PlaceListResDto(placeCollection, {
      take: placeListReqDto.take,
      hasNext: hasNext,
      cursorId: nextCursorId,
    });

    return placeListResCollection;
  }
}
