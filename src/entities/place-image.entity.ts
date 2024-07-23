import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';

@Entity()
export class PlaceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Place, (place) => place.placeImages)
  place: Place;

  @RelationId((placeImage: PlaceImage) => placeImage.place)
  @Column()
  placeId: number;

  @Column()
  url: string;
}
