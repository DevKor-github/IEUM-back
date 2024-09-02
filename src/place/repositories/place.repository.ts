import { Injectable } from '@nestjs/common';
import { Place } from 'src/place/entities/place.entity';
import { DataSource, Repository } from 'typeorm';
import { KakaoLocalSearchRes } from 'src/common/interfaces/kakao-local-search-res.interface';

@Injectable()
export class PlaceRepository extends Repository<Place> {
  constructor(private readonly dataSource: DataSource) {
    super(Place, dataSource.createEntityManager());
  }

  // ---------장소 검색---------
  async getPlaceDetailById(placeId: number): Promise<any> {
    return await this.createQueryBuilder('place')
      .leftJoinAndSelect('place.placeTags', 'placeTags')
      .leftJoinAndSelect('placeTags.tag', 'tag')
      .leftJoinAndSelect('place.placeImages', 'placeImages')
      // .leftJoinAndSelect('place.placeDetail', 'placeDetail')
      .where('place.id = :placeId', { placeId })
      .getOne();
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
      .orderBy('placeImage.id', 'DESC')
      .getOne();

    return placePreviewInfo;
  }

  async getPlacesByPlaceName(placeName: string): Promise<Place[]> {
    const places = await this.createQueryBuilder('place')
      .select(['place.id', 'place.name'])
      .where('place.name LIKE :placeName', { placeName: `%${placeName}%` })
      .take(10)
      .orderBy('place.id', 'DESC')
      .getMany();

    return places;
  }

  // ---------장소 생성---------

  async savePlaceByGooglePlaceDetail(placeDetail: any): Promise<Place> {
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

  async savePlaceByKakaoLocalSearchRes(
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
