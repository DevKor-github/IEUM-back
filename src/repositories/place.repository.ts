import { Injectable } from '@nestjs/common';
import { RawPlacePreview } from 'src/common/interfaces/raw-place-preview.interface';
import { KakaoLocalSearchRes } from 'src/common/interfaces/places.interface';
import { Place } from 'src/entities/place.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceRepository extends Repository<Place> {
  private placeRepository: Repository<Place>;

  constructor(private readonly dataSource: DataSource) {
    super(Place, dataSource.createEntityManager());
  }

  async getPlaceDetailById(placeId: number): Promise<Place> {
    return await this.createQueryBuilder('place')
      .leftJoinAndSelect('place.placeTags', 'placeTags')
      .leftJoinAndSelect('placeTags.tag', 'tag')
      .leftJoinAndSelect('place.placeImages', 'placeImages')
      .leftJoinAndSelect('place.placeDetail', 'placeDetail')
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

  async getPlaceInfoFromMarker(placeId: number): Promise<RawPlacePreview> {
    const placePreviewInfo = await this.createQueryBuilder('place')
      .leftJoinAndSelect('place.placeTags', 'placeTag')
      .leftJoinAndSelect('placeTag.tag', 'tag')
      .select([
        'place.id',
        'place.name',
        'place.address',
        'place.primary_category AS place_primary_category',
        'place.latitude',
        'place.longitude',
        'tag.tag_name AS place_tag_name',
      ])
      .where('place.id = :placeId', { placeId })

      .getRawOne();

    //db 바뀌고 나서 tag.type이 1,2,3인 것만 가져와야함.
    //.andWhere('tag.type in 1,2,3')
    //해쉬태그들을 배열로 반환.

    //db 바뀌고 나서 place와 image를 연결짓는 N:N 테이블이 사라짐. 새로 image 테이블 연결해야함.
    return placePreviewInfo;
  }
  async saveByKakaoPlace(
    kakaoLocalSearchRes: KakaoLocalSearchRes,
  ): Promise<Place> {
    return await this.save({
      name: kakaoLocalSearchRes.place_name,
      url: kakaoLocalSearchRes.place_url,
      address: kakaoLocalSearchRes.address_name,
      roadAddress: kakaoLocalSearchRes.road_address_name,
      kakaoId: kakaoLocalSearchRes.id,
      phone: kakaoLocalSearchRes.phone,
      primaryCategory: kakaoLocalSearchRes.category_group_name,
      latitude: Number(kakaoLocalSearchRes.y),
      longitude: Number(kakaoLocalSearchRes.x),
    });
  }
}
