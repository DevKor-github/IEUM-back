import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderListResDto } from './dtos/folder-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { NotAuthorizedException } from 'src/common/exceptions/user.exception';
import { DataSource } from 'typeorm';
import { FolderType } from 'src/common/enums/folder-type.enum';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
    private readonly dataSource: DataSource,
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
      throw new NotAuthorizedException('해당 권한 없음.');
    }
    if (targetFolder.type == FolderType.Default) {
      throw new NotAuthorizedException('Default 폴더는 삭제할 수 없습니다.');
    }
    //transaction 처리
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.folderPlaceRepository.deleteFolderPlace(
        folderId,
        queryRunner.manager,
      );
      await this.folderRepository.deleteFolder(folderId, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    return await this.folderRepository.changeFolderName(
      userId,
      folderId,
      folderName,
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
}
