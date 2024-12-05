import { Injectable } from '@nestjs/common';
import { RawCollectionPlace } from 'src/common/interfaces/raw-collection-place.interface';
import { DataSource, Repository } from 'typeorm';
import { CollectionPlace } from '../entities/collection-place.entity';

@Injectable()
export class CollectionPlaceRepository extends Repository<CollectionPlace> {
  constructor(dataSource: DataSource) {
    super(CollectionPlace, dataSource.createEntityManager());
  }

  async getCollectionPlaces(
    collectionId: number,
  ): Promise<RawCollectionPlace[]> {
    const collectionPlaces = await this.createQueryBuilder('collectionPlace')
      .leftJoinAndSelect('collectionPlace.place', 'place')
      .select([
        'place.id AS place_id',
        'place.name AS place_name',
        'place.address AS address',
        'place.primaryCategory AS primary_category',
        'collectionPlace.placeKeyword AS place_keyword',
        'collectionPlace.isSaved AS is_saved',
      ])
      .where('collectionPlace.collectionId = :collectionId', {
        collectionId: collectionId,
      })
      .getRawMany();

    return collectionPlaces;
  }

  async createCollectionPlace(
    collectionId: number,
    placeId: number,
    placeKeyword: string,
  ) {
    const existedCollectionPlace = await this.findOne({
      where: { collectionId: collectionId, placeId: placeId },
    });
    if (existedCollectionPlace) {
      return existedCollectionPlace;
    }
    await this.save({
      collectionId: collectionId,
      placeId: placeId,
      placeKeyword: placeKeyword,
    });
  }

  async updateCollectionPlaceIsSavedToTrue(
    collectionId: number,
    placeId: number,
  ) {
    const collectionPlace = await this.findOne({
      where: { collectionId: collectionId, placeId: placeId },
    });

    collectionPlace.isSaved = true;
    await this.save(collectionPlace);
  }
}
