import { Injectable } from '@nestjs/common';
import { placeDetailsForTransferring } from 'src/common/interfaces/google-places-api.interface';
import { PlaceDetail } from 'src/place/entities/place-detail.entity';
import { DataSource, Repository } from 'typeorm';
import { Place } from '../entities/place.entity';

@Injectable()
export class PlaceDetailRepository extends Repository<PlaceDetail> {
  constructor(private readonly dataSource: DataSource) {
    super(PlaceDetail, dataSource.createEntityManager());
  }

  async createPlaceDetailByGoogle(
    place: Place,
    placeDetailByGoogle: placeDetailsForTransferring,
  ) {
    const placeDetail = new PlaceDetail();
    placeDetail.place = place;
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
