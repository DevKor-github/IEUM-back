import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InstaGuestCollection } from 'src/entities/insta-guest-collection.entity';
import { CreateInstaGuestCollectionDto } from 'src/instagram/dtos/create-insta-guest-collection-dto';
import { INSTA_COLLECTIONS_TAKE } from 'src/common/constants/pagination.constant';
import {
  RawInstaCollection,
  RawInstaCollectionDetail,
  RawInstaPlaceMarker,
} from 'src/common/interfaces/raw-insta-collection.interface';

@Injectable()
export class InstaGuestCollectionRepository extends Repository<InstaGuestCollection> {
  constructor(dataSource: DataSource) {
    super(InstaGuestCollection, dataSource.createEntityManager());
  }

  async createInstaGuestCollection(
    createInstaGuestCollectionDto: CreateInstaGuestCollectionDto,
  ): Promise<InstaGuestCollection> {
    //한 아이디로 저장한 장소-게시글 쌍에 대한 중복 체크
    const instaGuestCollection = await this.findOne({
      where: {
        link: createInstaGuestCollectionDto.link,
      },
    });
    if (instaGuestCollection) {
      return null;
    }
    const newInstaGuestCollection = this.create(createInstaGuestCollectionDto);
    const saveNewInstaGuestCollection = await this.save(
      newInstaGuestCollection,
    );
    return saveNewInstaGuestCollection;
  }

  async getCollections(
    instaGuestUserId: number,
    region?: string,
    cursorId?: number,
    placeId?: number,
  ): Promise<RawInstaCollection[]> {
    const query = this.createQueryBuilder('instaGuestCollection')
      .leftJoinAndSelect('instaGuestCollection.place', 'place')
      .leftJoinAndSelect('place.placeTags', 'placeTags')
      .leftJoinAndSelect('placeTags.tag', 'tag')
      .select([
        'instaGuestCollection.id AS insta_guest_collection_id',
        'instaGuestCollection.placeId AS place_id',
        'instaGuestCollection.content AS instagram_description',
        'instaGuestCollection.embeddedTag AS embedded_tag',
        'place.name AS place_name',
        'place.address AS place_address',
        'place.latitude AS latitude',
        'place.longitude AS longitude',
        'place.primaryCategory AS primary_category',
        'JSON_AGG(DISTINCT tag.tagName) AS tags',
      ])
      .where('instaGuestCollection.instaGuestUserId = :instaGuestUserId', {
        instaGuestUserId,
      })
      .groupBy('instaGuestCollection.id')
      .addGroupBy('place.id')
      .orderBy('instaGuestCollection.id', 'DESC')
      .limit(INSTA_COLLECTIONS_TAKE + 1);

    if (region) {
      query.andWhere(
        'addressComponents.administrativeAreaLevel1 LIKE :region',
        {
          region: `${region}%`,
        },
      ); // 특정 문자열로 시작하는 경우에는 인덱스를 타므로 성능 문제 X
    }

    if (placeId) {
      query.andWhere('instaGuestCollection.placeId = :placeId', {
        placeId,
      });
    }

    if (cursorId) {
      query.andWhere('instaGuestCollection.id < :cursorId', {
        cursorId,
      });
    }

    return await query.getRawMany();
  }

  async getCollectionDetail(
    instaGuestUserId: number,
    instaGuestCollectionId: number,
  ): Promise<RawInstaCollectionDetail> {
    return await this.createQueryBuilder('instaGuestCollection')
      .leftJoinAndSelect('instaGuestCollection.place', 'place')
      .leftJoinAndSelect('place.openHours', 'openHours')
      .leftJoinAndSelect('place.placeTags', 'placeTags')
      .leftJoinAndSelect('placeTags.tag', 'tag')
      .leftJoinAndSelect('place.addressComponents', 'addressComponents')
      .select([
        'instaGuestCollection.id AS insta_guest_collection_id',
        'instaGuestCollection.placeId AS place_id',
        'instaGuestCollection.content AS instagram_description',
        'instaGuestCollection.embeddedTag AS embedded_tag',
        'instaGuestCollection.link AS link',
        'place.name AS place_name',
        'place.latitude AS latitude',
        'place.longitude AS longitude',
        'place.address AS address',
        'place.phoneNumber AS phone_number',
        'place.primaryCategory AS primary_category',
        'openHours.opening AS open_hours',
        'JSON_AGG(DISTINCT tag.tagName) AS tags',
        'addressComponents.administrativeAreaLevel1 AS address_level1',
        'COALESCE(addressComponents.locality, addressComponents.sublocalityLevel1) AS address_level2',
      ])
      .where('instaGuestCollection.instaGuestUserId = :instaGuestUserId', {
        instaGuestUserId,
      })
      .andWhere('instaGuestCollection.id = :instaGuestCollectionId', {
        instaGuestCollectionId,
      })
      .groupBy('instaGuestCollection.id')
      .addGroupBy('place.id')
      .addGroupBy('addressComponents.id')
      .addGroupBy('openHours.id')
      .getRawOne();
  }
}
