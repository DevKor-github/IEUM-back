import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { FolderPlace } from 'src/entities/folder-place.entity';
import { MarkerResDto } from 'src/place/dtos/marker-res.dto';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { PlacesListDataDto } from 'src/place/dtos/places-list-res.dto';
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
  ): Promise<MarkerResDto[]> {
    const markerCollection = this.createQueryBuilder('folderPlace')
      .leftJoin('folderPlace.folder', 'folder')
      .leftJoinAndSelect('folderPlace.place', 'place')
      .select([
        'place.id',
        'place.name',
        'place.latitude',
        'place.longitude',
        'place.primary_category',
      ])
      .where('folder.user_id = :userId', { userId });

    //folder별로 보여줘야 한다면
    if (folderId !== undefined) {
      markerCollection.andWhere('folder.id = :folderId', { folderId });
    } else {
      markerCollection.andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      });
    }
    //address로 필터링 되어야 한다면
    //place.address LIKE a% OR b%는 지원하지 않아 place.address LIKE a% OR place.address LIKE b%와 같이 작성하여야 함.
    if (addressList && addressList.length != 0) {
      const addressConditions = addressList.map(
        (address, index) => `place.address LIKE :address${index}`,
      );
      markerCollection.andWhere(
        `(${addressConditions.join(' OR ')})`,
        addressList.reduce((params, address, index) => {
          params[`address${index}`] = `${address}%`;
          return params;
        }, {}),
      );
    }

    //category로 필터링 되어야 한다면
    if (categoryList && categoryList.length != 0) {
      markerCollection
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', categoryList);
    }

    const result = await markerCollection
      .orderBy('place.id', 'DESC')
      .getRawMany();

    //plainToInstance함수는 javascript 객체를 특정 class의 instance로 변환시켜준다.
    return plainToInstance(MarkerResDto, result);
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<PlacesListDataDto[]> {
    const placeCollection = this.createQueryBuilder('folderPlace')
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
      placeCollection.andWhere('folder.id = :folderId', { folderId });
    } else {
      placeCollection.andWhere('folder.type = :folderType', {
        folderType: FolderType.Default,
      });
    }

    //두 번째 호출부터라 cursor값이 있다면
    if (placesListReqDto.cursorId) {
      placeCollection.andWhere('place.id < :cursorId', {
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
      placeCollection.andWhere(
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
      placeCollection
        .andWhere('place.primary_category IN (:...categories)')
        .setParameter('categories', placesListReqDto.categoryList);
    }
    placeCollection
      .orderBy('place.id', 'DESC')
      .limit(placesListReqDto.take + 1);

    const result = await placeCollection.getRawMany();
    //place_image join 추가해서 image url 반환 해야함.

    return result;
  }
}
