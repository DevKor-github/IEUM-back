import { Injectable } from '@nestjs/common';
import { Place } from 'src/entities/place.entity';
import { DataSource, Repository } from 'typeorm';
import { TagType } from 'src/common/enums/tag-type.enum';
import { Tag } from 'src/entities/tag.entity';
import { KakaoLocalSearchRes } from 'src/common/interfaces/kakao-local-search-res.interface';

@Injectable()
export class PlaceRepository extends Repository<Place> {
  private placeRepository: Repository<Place>;

  constructor(private readonly dataSource: DataSource) {
    super(Place, dataSource.createEntityManager());
  }

  async getPlaceDetailById(placeId: number): Promise<any> {
    return await this.createQueryBuilder('place')
      .leftJoinAndSelect('place.placeTags', 'placeTags')
      .leftJoinAndSelect('placeTags.tag', 'tag')
      .leftJoinAndSelect('place.placeImages', 'placeImages')
      // .leftJoinAndSelect('place.placeDetail', 'placeDetail')
      .where('place.id = :placeId', { placeId })
      .getOne();
  }

  async saveByGooglePlaceDetail(placeDetail: any): Promise<Place> {
    return await this.save({
      name: placeDetail.displayName.text,
      address: placeDetail.formattedAddress,
      latitude: placeDetail.location.latitude,
      longitude: placeDetail.location.longitude,
      googlePlaceId: placeDetail.id,
      phoneNumber: placeDetail.nationalPhoneNumber,
      primaryCategory: placeDetail.types[0],
    });
  }

  async getPlacePreviewInfoById(placeId: number): Promise<Place> {
    const placePreviewInfo = await this.createQueryBuilder('place')
      .leftJoinAndSelect('place.placeTags', 'placeTag')
      .leftJoinAndSelect('placeTag.tag', 'tag')
      .leftJoinAndSelect('place.placeImages', 'placeImage')
      .select([
        'place.id',
        'place.name',
        'place.address',
        'place.primaryCategory',
        'place.latitude',
        'place.longitude',
        'placeTag',
        'tag',
        'placeImage',
      ])
      .where('place.id = :placeId', { placeId })
      .getOne();

    return placePreviewInfo;
  }
  async saveByKakaoPlace(
    kakaoLocalSearchRes: KakaoLocalSearchRes,
  ): Promise<Place> {
    const existedPlace = await this.findOne({
      where: { kakaoId: kakaoLocalSearchRes.id },
    });
    if (existedPlace) {
      return existedPlace;
    }

    return await this.save({
      name: kakaoLocalSearchRes.place_name,
      url: kakaoLocalSearchRes.place_url,
      address: kakaoLocalSearchRes.address_name,
      roadAddress: kakaoLocalSearchRes.road_address_name,
      kakaoId: kakaoLocalSearchRes.id,
      phone: kakaoLocalSearchRes.phone,
      primaryCategory:
        kakaoLocalSearchRes.category_group_name.length !== 0
          ? kakaoLocalSearchRes.category_group_name
          : kakaoLocalSearchRes.category_name.split(' > ')[1],
      latitude: Number(kakaoLocalSearchRes.y),
      longitude: Number(kakaoLocalSearchRes.x),
    });
  }
}
