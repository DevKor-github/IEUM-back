import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  COLLECTIONS_TAKE,
  INSTA_COLLECTIONS_TAKE,
} from 'src/common/constants/pagination.constant';
import {
  RawInstaCollection,
  RawInstaCollectionDetail,
  RawInstaPlaceMarker,
} from 'src/common/interfaces/raw-insta-collection.interface';
import { Collection } from 'src/entities/collection.entity';
import { CreateCollectionReqDto } from 'src/collection/dtos/create-collection-req.dto';
import { RawCollection } from 'src/common/interfaces/raw-collection.interface';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  // async createCollection(
  //   createCollectionDto: CreateCollectionDto,
  // ): Promise<Collection> {
  //   //한 아이디로 저장한 장소-게시글 쌍에 대한 중복 체크
  //   const Collection = await this.findOne({
  //     where: {
  //       link: createCollectionDto.link,
  //     },
  //   });
  //   if (Collection) {
  //     return null;
  //   }
  //   const newCollection = this.create(createCollectionDto);
  //   const saveNewCollection = await this.save(
  //     newCollection,
  //   );
  //   return saveNewCollection;
  // }
  async createCollection(
    userId: number,
    link: string,
    content?: string,
  ): Promise<Collection> {
    // 한 아이디로 저장한 장소-게시글 쌍에 대한 중복 체크 -> isDuplicated를 떼서 위임
    // const existedCollection = await this.findOne({
    //   where: { userId: userId, link: link },
    // });
    // if (existedCollection) {
    //   return existedCollection;
    // }
    const newCollection = new Collection();
    newCollection.userId = userId;
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
        `SUM(CASE WHEN collectionPlaces.isSave = true THEN 1 ELSE 0 END) as saved_collection_places_count`,
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

  //deprecated
  // async getCollections(
  //   instaGuestUserId: number,
  //   region?: string,
  //   cursorId?: number,
  //   placeId?: number,
  // ): Promise<RawInstaCollection[]> {
  //   const query = this.createQueryBuilder('instaGuestCollection')
  //     .leftJoinAndSelect('instaGuestCollection.place', 'place')
  //     .leftJoinAndSelect('place.placeTags', 'placeTags')
  //     .leftJoinAndSelect('placeTags.tag', 'tag')
  //     .select([
  //       'instaGuestCollection.id AS insta_guest_collection_id',
  //       'instaGuestCollection.placeId AS place_id',
  //       'instaGuestCollection.content AS instagram_description',
  //       'instaGuestCollection.embeddedTag AS embedded_tag',
  //       'place.name AS place_name',
  //       'place.address AS place_address',
  //       'place.latitude AS latitude',
  //       'place.longitude AS longitude',
  //       'place.primaryCategory AS primary_category',
  //       'JSON_AGG(DISTINCT tag.tagName) AS tags',
  //     ])
  //     .where('instaGuestCollection.instaGuestUserId = :instaGuestUserId', {
  //       instaGuestUserId,
  //     })
  //     .groupBy('instaGuestCollection.id')
  //     .addGroupBy('place.id')
  //     .orderBy('instaGuestCollection.id', 'DESC')
  //     .limit(INSTA_COLLECTIONS_TAKE + 1);

  //   if (region) {
  //     query.andWhere(
  //       'addressComponents.administrativeAreaLevel1 LIKE :region',
  //       {
  //         region: `${region}%`,
  //       },
  //     ); // 특정 문자열로 시작하는 경우에는 인덱스를 타므로 성능 문제 X
  //   }

  //   if (placeId) {
  //     query.andWhere('instaGuestCollection.placeId = :placeId', {
  //       placeId,
  //     });
  //   }

  //   if (cursorId) {
  //     query.andWhere('instaGuestCollection.id < :cursorId', {
  //       cursorId,
  //     });
  //   }

  //   return await query.getRawMany();
  // }

  // async getCollectionDetail(
  //   instaGuestUserId: number,
  //   instaGuestCollectionId: number,
  // ): Promise<RawInstaCollectionDetail> {
  //   return await this.createQueryBuilder('instaGuestCollection')
  //     .leftJoinAndSelect('instaGuestCollection.place', 'place')
  //     .leftJoinAndSelect('place.openHours', 'openHours')
  //     .leftJoinAndSelect('place.placeTags', 'placeTags')
  //     .leftJoinAndSelect('placeTags.tag', 'tag')
  //     .leftJoinAndSelect('place.addressComponents', 'addressComponents')
  //     .select([
  //       'instaGuestCollection.id AS insta_guest_collection_id',
  //       'instaGuestCollection.placeId AS place_id',
  //       'instaGuestCollection.content AS instagram_description',
  //       'instaGuestCollection.embeddedTag AS embedded_tag',
  //       'instaGuestCollection.link AS link',
  //       'place.name AS place_name',
  //       'place.latitude AS latitude',
  //       'place.longitude AS longitude',
  //       'place.address AS address',
  //       'place.phoneNumber AS phone_number',
  //       'place.primaryCategory AS primary_category',
  //       'openHours.opening AS open_hours',
  //       'JSON_AGG(DISTINCT tag.tagName) AS tags',
  //       'addressComponents.administrativeAreaLevel1 AS address_level1',
  //       'COALESCE(addressComponents.locality, addressComponents.sublocalityLevel1) AS address_level2',
  //     ])
  //     .where('instaGuestCollection.instaGuestUserId = :instaGuestUserId', {
  //       instaGuestUserId,
  //     })
  //     .andWhere('instaGuestCollection.id = :instaGuestCollectionId', {
  //       instaGuestCollectionId,
  //     })
  //     .groupBy('instaGuestCollection.id')
  //     .addGroupBy('place.id')
  //     .addGroupBy('addressComponents.id')
  //     .addGroupBy('openHours.id')
  //     .getRawOne();
  // }
}
