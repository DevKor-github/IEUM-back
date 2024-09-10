import { Injectable } from '@nestjs/common';
import { GooglePlacesApiDetail } from 'src/common/interfaces/google-places-api-detail.interface';
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

  async createPlaceDetailByGoogle(
    placeId: number,
    placeDetailByGoogle: GooglePlacesApiDetail,
  ) {
    const placeDetail = new PlaceDetail();
    placeDetail.placeId = placeId;
    placeDetail.weekDaysOpeningHours = placeDetailByGoogle.weekDaysOpeningHours;
    placeDetail.freeParkingLot = placeDetailByGoogle.freeParkingLot;
    placeDetail.paidParkingLot = placeDetailByGoogle.paidParkingLot;
    placeDetail.freeStreetParking = placeDetailByGoogle.freeStreetParking;
    placeDetail.allowsDogs = placeDetailByGoogle.allowsDogs;
    placeDetail.goodForGroups = placeDetailByGoogle.goodForGroups;
    placeDetail.takeout = placeDetailByGoogle.takeout;
    placeDetail.delivery = placeDetailByGoogle.delivery;
    placeDetail.reservable = placeDetailByGoogle.reservable;
    placeDetail.googleMapsUri = placeDetailByGoogle.googleMapsUri;

    return await this.save(placeDetail);
  }
}
