import { Injectable } from '@nestjs/common';
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
}
