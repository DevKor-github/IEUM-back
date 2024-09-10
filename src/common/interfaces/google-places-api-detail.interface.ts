export interface GooglePlacesApiDetail {
  weekDaysOpeningHours?: string[]; // 월요일 ~ 화요일 ~...
  freeParkingLot?: boolean;
  paidParkingLot?: boolean;
  freeStreetParking?: boolean;
  allowsDogs?: boolean;
  goodForGroups?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  reservable?: boolean;
  googleMapsUri?: string;
}

/*
"parkingOptions": {
    "freeParkingLot": false
  }
  parkingOptions: { freeParkingLot: false, freeStreetParking: false }
  paidParkingLot: true
*/
