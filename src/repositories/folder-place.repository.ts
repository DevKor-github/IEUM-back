import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { RawMarker } from 'src/common/interfaces/raw-marker.interface';
import { RawPlaceInfo } from 'src/common/interfaces/raw-place-info.interface';
import { FolderPlace } from 'src/entities/folder-place.entity';
import { MarkerResDto } from 'src/place/dtos/markers-list-res.dto';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class FolderPlaceRepository extends Repository<FolderPlace> {
  private readonly folderPlaceRepository: Repository<FolderPlace>;
  constructor(private readonly dataSource: DataSource) {
    super(FolderPlace, dataSource.createEntityManager());
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
    placeIds.map(
      async (placeId) =>
        await this.delete({ folderId: folderId, placeId: placeId }),
    );
  }

  async deleteAllFolderPlaces(placeIds: number[]) {
    await Promise.all(
      placeIds.map((placeId) => this.delete({ placeId: placeId })),
    );
  }

  async getMarkers(
    userId: number,
    addressList: string[],
    categoryList: string[],
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
        'place.primary_category as category',
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
    if (categoryList && categoryList.length != 0) {
      query
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', categoryList);
    }

    const rawMarkersList = await query.orderBy('place.id', 'DESC').getRawMany();

    return rawMarkersList;
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<RawPlaceInfo[]> {
    const query = this.createQueryBuilder('folderPlace')
      .leftJoin('folderPlace.folder', 'folder')
      .leftJoinAndSelect('folderPlace.place', 'place')
      .select([
        'place.id AS id',
        'place.name AS name',
        'place.address AS address',
        'place.primary_category AS category ',
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

    //두 번째 호출부터라 cursor값이 있다면
    if (placesListReqDto.cursorId) {
      query.andWhere('place.id < :cursorId', {
        cursorId: placesListReqDto.cursorId,
      });
    }

    if (
      placesListReqDto.addressList &&
      placesListReqDto.addressList.length != 0
    ) {
      const addressConditions = placesListReqDto.addressList.map(
        (address, index) => `place.address LIKE :address${index}`,
      );
      query.andWhere(
        `(${addressConditions.join(' OR ')})`,
        placesListReqDto.addressList.reduce((params, address, index) => {
          params[`address${index}`] = `${address}%`;
          return params;
        }, {}),
      );
    }
    if (
      placesListReqDto.categoryList &&
      placesListReqDto.categoryList.length != 0
    ) {
      query
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', placesListReqDto.categoryList);
    }
    query.orderBy('place.id', 'DESC').limit(placesListReqDto.take + 1);

    const rawPlacesInfoList = await query.getRawMany();
    return rawPlacesInfoList;
  }
}
