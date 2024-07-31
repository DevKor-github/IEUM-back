import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderResDto, FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';
import {
  MarkerResDto,
  MarkersListResDto,
} from 'src/place/dtos/markers-list-res.dto';
import { ForbiddenFolderException } from 'src/common/exceptions/folder.exception';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { PlacesListResDto } from 'src/place/dtos/places-list-res.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFoldersList(userId: number): Promise<FoldersListResDto> {
    const rawFoldersList = await this.folderRepository.getFoldersList(userId);
    const foldersList = new FoldersListResDto(rawFoldersList);
    return foldersList;
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
      throw new ForbiddenFolderException(
        '해당 폴더의 소유주가 아니라 권한이 없음.',
      );
    }
    if (targetFolder.type == FolderType.Default) {
      throw new ForbiddenFolderException(
        'Default 폴더에 대한 권한이 없어 삭제할 수 없음.',
      );
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

  async deleteFolderPlaces(
    userId: number,
    folderId: number,
    placeIds: number[],
  ) {
    const targetFolder =
      await this.folderRepository.findFolderByFolderId(folderId);

    if (targetFolder.userId != userId) {
      throw new ForbiddenFolderException(
        '해당 폴더의 소유주가 아니라 권한이 없음.',
      );
    }

    if (targetFolder.type == FolderType.Default) {
      return await this.folderPlaceRepository.deleteAllFolderPlaces(placeIds);
    }

    return await this.folderPlaceRepository.deleteFolderPlaces(
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
  ): Promise<MarkersListResDto> {
    return new MarkersListResDto(
      await this.folderPlaceRepository.getMarkers(
        userId,
        addressList,
        categoryList,
        folderId,
      ),
    );
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<PlacesListResDto> {
    const placeCollection = await this.folderPlaceRepository.getPlacesList(
      userId,
      placesListReqDto,
      folderId,
    );

    //주소 형태 변환
    placeCollection.map((place) => {
      const shortAddress = place.address.split(' ');
      place.address = shortAddress.slice(0, 2).join(' ');
    });

    let nextCursorId: number = null;

    const hasNext = placeCollection.length > placesListReqDto.take;

    if (!hasNext) {
      nextCursorId = null;
    } else {
      nextCursorId = placeCollection[placeCollection.length - 2].id;
      placeCollection.pop();
    }

    const placeListResCollection = new PlacesListResDto(placeCollection, {
      take: placesListReqDto.take,
      hasNext: hasNext,
      cursorId: nextCursorId,
    });

    return placeListResCollection;
  }
}
