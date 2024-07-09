import { Injectable } from '@nestjs/common';
import { InstaGuestUserCollection } from 'src/entities/insta-guest-user-collection.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InstaGuestUserCollectionRepository extends Repository<InstaGuestUserCollection> {
  private readonly instaGuestUserCollectionRepository: Repository<InstaGuestUserCollection>;
  constructor(dataSource: DataSource) {
    super(InstaGuestUserCollection, dataSource.createEntityManager());
  }

  async createInstaGuestUserCollection(
    instaGuestUserId: number,
    instaGuestCollectionId: number,
  ) {
    return await this.save({
      instaGuestUserId: instaGuestUserId,
      instaGuestCollectionId: instaGuestCollectionId,
    });
  }
}
