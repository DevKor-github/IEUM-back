import { Injectable } from '@nestjs/common';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { RawMarker } from 'src/common/interfaces/raw-marker.interface';
import { RawPlaceInfo } from 'src/common/interfaces/raw-place-info.interface';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { DataSource, Repository } from 'typeorm';
import { FolderPlace } from '../entities/folder-place.entity';

@Injectable()
export class FolderPlaceRepository extends Repository<FolderPlace> {
  constructor(dataSource: DataSource) {
    super(FolderPlace, dataSource.createEntityManager());
  }

  async checkFolderPlaceExistence(
    folderId: number,
    placeId: number,
  ): Promise<boolean> {
    const folderPlace = await this.findOne({
      where: { folderId: folderId, placeId: placeId },
    });
    return !!folderPlace;
  }

  async getFolderThumbnail(folderId: number): Promise<string> {
    const result = await this.createQueryBuilder('folderPlace')
      .leftJoin('folderPlace.place', 'place')
      .leftJoin('place.placeImages', 'placeImage')
      .select('placeImage.url', 'url')
      .where('folderPlace.folderId = :folderId', { folderId })
      .andWhere('placeImage.url IS NOT NULL') // PlaceImage가 존재하는 경우만 필터링
      .limit(1) // 첫 번째 결과만 가져옴
      .getRawOne();

    return result?.url;
  }

  async getMarkers(
    userId: number,
    addressList: string[],
    mappedCategories: string[],
    folderId?: number,
  ): Promise<RawMarker[]> {
    const query = this.createQueryBuilder('folderPlace')
      .leftJoin('folderPlace.folder', 'folder')
      .leftJoinAndSelect('folderPlace.place', 'place')
      .select([
        'place.id as id',
        'place.name as name',
        'place.latitude as latitude',
        'place.longitude as longitude',
        'place.primary_category as primary_category',
      ])
      .where('folder.user_id = :userId', { userId });

    //folder별로 보여줘야 한다면
    if (folderId !== undefined) {
      query.andWhere('folder.id = :folderId', { folderId });
    } else {
      query.andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      });
    }
    //address로 필터링 되어야 한다면
    //place.address LIKE a% OR b%는 지원하지 않아 place.address LIKE a% OR place.address LIKE b%와 같이 작성하여야 함.
    if (addressList && addressList.length != 0) {
      const addressConditions = addressList.map(
        (address, index) => `place.address LIKE :address${index}`,
      );
      query.andWhere(
        `(${addressConditions.join(' OR ')})`,
        addressList.reduce((params, address, index) => {
          params[`address${index}`] = `${address}%`;
          return params;
        }, {}),
      );
    }

    //category로 필터링 되어야 한다면
    if (mappedCategories && mappedCategories.length != 0) {
      query
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', mappedCategories);
    }

    const rawMarkersList = await query.orderBy('place.id', 'DESC').getRawMany();

    return rawMarkersList;
  }

  async getPlacesList(
    userId: number,
    take: number,
    addressList: string[],
    mappedCategories: string[],
    cursorId?: number,
    folderId?: number,
  ): Promise<RawPlaceInfo[]> {
    const query = this.createQueryBuilder('folderPlace')
      .leftJoin('folderPlace.folder', 'folder')
      .leftJoinAndSelect('folderPlace.place', 'place')
      .leftJoinAndSelect('place.placeImages', 'placeImage')
      .select([
        'place.id AS id',
        'place.name AS name',
        'place.address AS address',
        'place.primary_category AS primary_category ',
        'ARRAY_AGG(placeImage.url ORDER BY placeImage.id DESC) AS "image_urls"',
      ])
      .where('folder.user_id = :userId', { userId })
      .groupBy('place.id')
      .orderBy('place.id', 'DESC');

    //folder별로 보여줘야 한다면
    if (folderId !== undefined) {
      query.andWhere('folder.id = :folderId', { folderId });
    } else {
      query.andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      });
    }

    //두 번째 호출부터라 cursor값이 있다면
    if (cursorId) {
      query.andWhere('place.id < :cursorId', {
        cursorId: cursorId,
      });
    }

    if (addressList && addressList.length != 0) {
      const addressConditions = addressList.map(
        (address, index) => `place.address LIKE :address${index}`,
      );
      query.andWhere(
        `(${addressConditions.join(' OR ')})`,
        addressList.reduce((params, address, index) => {
          params[`address${index}`] = `${address}%`;
          return params;
        }, {}),
      );
    }

    if (mappedCategories && mappedCategories.length != 0) {
      query
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', mappedCategories);
    }
    query.limit(take + 1);

    const rawPlacesInfoList = await query.getRawMany();
    return rawPlacesInfoList;
  }

  async createFolderPlace(folderId: number, placeId: number) {
    const folderPlace = await this.findOne({
      where: { folderId: folderId, placeId: placeId },
    });
    if (folderPlace) {
      return folderPlace;
    }
    const newFolderPlace = new FolderPlace();
    newFolderPlace.folderId = folderId;
    newFolderPlace.placeId = placeId;
    const saveNewFolderPlace = await this.save(newFolderPlace);
    return saveNewFolderPlace;
  }

  async deleteFolderPlaces(folderId: number, placeIds: number[]) {
    // 특정 폴더에 대한 폴더-장소 관계 삭제
    placeIds.map(
      async (placeId) =>
        await this.delete({ folderId: folderId, placeId: placeId }),
    );
  }
}
