import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class PlaceSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  visitingDate: Date;

  @ManyToOne(() => Place, (place) => place.placeSchedules, {
    onDelete: 'CASCADE',
  })
  place: Place;

  @RelationId((placeSchedule: PlaceSchedule) => placeSchedule.place)
  @Column()
  placeId: number;

  @ManyToOne(() => Trip, (trip) => trip.placeSchedules, { onDelete: 'CASCADE' })
  trip: Trip;

  @RelationId((placeSchedule: PlaceSchedule) => placeSchedule.trip)
  @Column()
  tripId: number;
}
