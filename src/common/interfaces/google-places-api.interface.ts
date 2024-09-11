export interface GooglePlacesApiPlaceDetailsRes {
  id: string;
  name: string;
  displayName: string;
  googleMapsUri: string;
  photos?: any[];
  regularOpeningHours?: {
    weekdayDescriptions: string[];
  };
  parkingOptions?: {
    freeParkingLot?: boolean;
    paidParkingLot?: boolean;
    freeStreetParking?: boolean;
  };
  allowsDogs?: boolean;
  goodForGroups?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  reservable?: boolean;
}

export interface placeDetailsForTransferring {
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
