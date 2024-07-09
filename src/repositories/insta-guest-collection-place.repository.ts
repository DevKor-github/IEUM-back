import { Injectable } from '@nestjs/common';
import { InstaGuestCollectionPlace } from 'src/entities/insta-guest-collection-place.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InstaGuestCollectionPlaceRepository extends Repository<InstaGuestCollectionPlace> {
  private readonly instaGuestCollectionPlaceRepository: Repository<InstaGuestCollectionPlace>;
  constructor(dataSource: DataSource) {
    super(InstaGuestCollectionPlace, dataSource.createEntityManager());
  }

  async createInstaGuestCollectionPlace(
    instaGuestCollectionId: number,
    placeId: number,
  ) {
    await this.save({
      instaGuestCollectionId: instaGuestCollectionId,
      placeId: placeId,
    });
  }
}
