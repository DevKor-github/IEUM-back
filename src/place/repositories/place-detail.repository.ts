import { Injectable } from '@nestjs/common';
import { PlaceDetailByGoogle } from 'src/common/interfaces/place-detail-google.interface';
import { PlaceDetail } from 'src/place/entities/place-detail.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceDetailRepository extends Repository<PlaceDetail> {
  constructor(private readonly dataSource: DataSource) {
    super(PlaceDetail, dataSource.createEntityManager());
  }

  async saveByPlaceDetailByGoogle(
    placeId: number,
    placeDetail: PlaceDetailByGoogle,
  ) {
    return await this.save({
      placeId: placeId,
      phoneNumber: placeDetail.nationalPhoneNumber,
      websiteUrl: placeDetail.websiteUrl,
      parkingOptions: placeDetail.parkingOptions,
      allowsDogs: placeDetail.allowsDogs,
      goodForGroups: placeDetail.goodForGroups,
      reservable: placeDetail.reservable,
      delivery: placeDetail.delivery,
      takeout: placeDetail.takeout,
    });
  }
}
