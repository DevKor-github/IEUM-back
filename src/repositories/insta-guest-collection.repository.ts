import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InstaGuestCollection } from 'src/entities/insta-guest-collection.entity';
import { CreateInstaGuestCollectionDto } from 'src/instagram/dtos/create-insta-guest-collection-dto';

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
        instaGuestUserId: createInstaGuestCollectionDto.instaGuestUserId,
        placeId: createInstaGuestCollectionDto.placeId,
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

  async getMarkers(instaGuestUserId: number) {
    return await this.createQueryBuilder('instaGuestCollection')
      .leftJoinAndSelect('instaGuestCollection.place', 'place')
      .leftJoinAndSelect('place.placeCategories', 'placeCategories')
      .leftJoinAndSelect('placeCategories.category', 'category')
      .select([
        'instaGuestCollection.id AS InstaGuestCollectionId',
        'instaGuestCollection.placeId AS placeId',
        'place.name AS placeName',
        'place.latitude AS latitude',
        'place.longitude AS longitude',
        'JSON_AGG(DISTINCT category.categoryName) AS categories',
      ])
      .where('instaGuestCollection.instaGuestUserId = :instaGuestUserId', {
        instaGuestUserId,
      })
      .groupBy('instaGuestCollection.id')
      .addGroupBy('place.id')
      .getRawMany();
  }
}

// export class InstaCollectionMarkerDto {
//   @ApiProperty()
//   @IsNotEmpty()
//   instaGuestCollectionId: number;

//   @ApiProperty()
//   @IsNotEmpty()
//   placeId: number;

//   @ApiProperty()
//   @IsNotEmpty()
//   placeName: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   latitude: number;

//   @ApiProperty()
//   @IsNotEmpty()
//   longitude: number;

//   @ApiProperty()
//   @IsNotEmpty()
//   category: string;
// }
