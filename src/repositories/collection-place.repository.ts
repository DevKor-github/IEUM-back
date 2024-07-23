import { Injectable } from '@nestjs/common';
import { RawCollectionPlace } from 'src/common/interfaces/raw-collection-place.interface';
import { CollectionPlace } from 'src/entities/collection-place.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CollectionPlaceRepository extends Repository<CollectionPlace> {
  private readonly CollectionPlaceRepository: Repository<CollectionPlace>;
  constructor(dataSource: DataSource) {
    super(CollectionPlace, dataSource.createEntityManager());
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

  async getCollectionPlaces(
    collectionId: number,
  ): Promise<RawCollectionPlace[]> {
    const collectionPlaces = await this.createQueryBuilder('collectionPlace')
      .leftJoinAndSelect('collectionPlace.place', 'place')
      .select([
        'place.id AS placeId',
        'place.kakaoId AS kakaoId',
        'place.name AS placeName',
        'place.address AS address',
        'place.primaryCategory AS category',
        'collectionPlace.placeKeyword AS placeKeyword',
        'collectionPlace.isSaved AS isSaved',
      ])
      .where('collectionPlace.collectionId = :collectionId', {
        collectionId: collectionId,
      })
      .getRawMany();

    return collectionPlaces;
  }
}
