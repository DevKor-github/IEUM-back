import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { COLLECTIONS_TAKE } from 'src/common/constants/pagination.constant';
import { RawCollection } from 'src/common/interfaces/raw-collection.interface';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { Collection } from '../entities/collection.entity';
import { RawLinkedColletion } from 'src/common/interfaces/raw-linked-collection.interface';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async getViewedCollections(
    userId: number,
    cursorId: number,
  ): Promise<RawCollection[]> {
    const query = this.createQueryBuilder('collection')
      .leftJoinAndSelect('collection.collectionPlaces', 'collectionPlaces')
      .select([
        'collection.id AS id',
        'collection.link AS link',
        'collection.collection_type AS collection_type',
        'collection.content AS content',
        'collection.isViewed AS is_viewed',
        'COUNT(collectionPlaces.id) as collection_places_count',
        `SUM(CASE WHEN collectionPlaces.isSaved = true THEN 1 ELSE 0 END) as saved_collection_places_count`,
      ])
      .where('collection.userId = :userId', { userId })
      .andWhere('collection.isViewed = true')
      .groupBy('collection.id')
      .orderBy(`collection.id`, 'DESC')
      .limit(COLLECTIONS_TAKE + 1);

    if (cursorId) {
      query.andWhere('collection.id < :cursorId', {
        cursorId,
      });
    }
    return await query.getRawMany();
  }

  async getUnviewedCollections(
    userId: number,
    cursorId: number,
  ): Promise<RawCollection[]> {
    const query = this.createQueryBuilder('collection')
      .leftJoinAndSelect('collection.collectionPlaces', 'collectionPlaces')
      .select([
        'collection.id AS id',
        'collection.link AS link',
        'collection.collection_type AS collection_type',
        'collection.content AS content',
        'collection.isViewed AS is_viewed',
        'COUNT(collectionPlaces.id) as collection_places_count',
      ])
      .where('collection.userId = :userId', { userId })
      .andWhere('collection.isViewed = false')
      .groupBy('collection.id')
      .orderBy(`collection.id`, 'DESC')
      .limit(COLLECTIONS_TAKE + 1);

    if (cursorId) {
      query.andWhere('collection.id < :cursorId', {
        cursorId,
      });
    }
    return await query.getRawMany();
  }

  async getLinkedCollections(
    userId: number,
    placeId: number,
  ): Promise<RawLinkedColletion[]> {
    return await this.createQueryBuilder('collection')
      .leftJoinAndSelect('collection.collectionPlaces', 'collectionPlaces')
      .select([
        'collection.id AS id',
        'collection.link AS link',
        'collection.collection_type AS collection_type',
        'collection.content AS content',
        'collection.isViewed AS is_viewed',
        'collection.updatedAt AS updated_at',
      ])
      .where('collection.userId = :userId', { userId })
      .andWhere('collectionPlaces.placeId = :placeId', { placeId })
      .groupBy('collection.id')
      .orderBy(`collection.id`, 'DESC')
      .getRawMany();
  }

  async createCollection(
    userId: number,
    collectionType: CollectionType,
    link: string,
    content?: string,
  ): Promise<Collection> {
    const newCollection = new Collection();
    newCollection.userId = userId;
    newCollection.collectionType = collectionType;
    newCollection.link = link;
    newCollection.content = content ? content : null;
    return await this.save(newCollection);
  }

  async isDuplicatedCollection(userId: number, link: string): Promise<boolean> {
    const existedCollection = await this.findOne({
      where: { userId: userId, link: link },
    });
    return existedCollection ? true : false;
  }

  async updateIsViewed(userId: number, collectionId: number): Promise<void> {
    await this.createQueryBuilder('collection')
      .update(Collection)
      .set({ isViewed: true })
      .where('collection.user_id = :userId', { userId })
      .andWhere('collection.id = :collectionId', { collectionId })
      .execute();
  }
}
