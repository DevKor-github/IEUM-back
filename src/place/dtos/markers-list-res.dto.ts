import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { RawMarker } from 'src/common/interfaces/raw-marker.interface';

export class MarkerResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  constructor(rawMarker: RawMarker) {
    this.id = rawMarker.id;
    this.name = rawMarker.name;
    this.category = rawMarker.category;
    this.latitude = rawMarker.latitude;
    this.longitude = rawMarker.longitude;
  }
}

export class MarkersListResDto {
  @ApiProperty({ type: [MarkerResDto] })
  @IsArray()
  markersList: MarkerResDto[];

  constructor(rawMarkersList: RawMarker[]) {
    this.markersList = rawMarkersList.map(
      (rawMarker) => new MarkerResDto(rawMarker),
    );
  }
}
