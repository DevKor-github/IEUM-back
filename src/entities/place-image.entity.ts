import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PlaceImage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Place, (place) => place.placeImages)
  place: Place;

  @ApiProperty()
  @RelationId((placeImage: PlaceImage) => placeImage.place)
  @Column()
  placeId: number;

  @ApiProperty()
  @Column()
  url: string;
}
