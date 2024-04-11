import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';
import { Trip } from './trip.entity';

@Entity()
export class PlaceSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  visitingDate: Date;

  @ManyToOne(() => Place, (place) => place.placeSchedules)
  place: Place;

  @RelationId((placeSchedule: PlaceSchedule) => placeSchedule.place)
  @Column()
  placeId: number;

  @ManyToOne(() => Trip, (trip) => trip.placeSchedules)
  trip: Trip;

  @RelationId((placeSchedule: PlaceSchedule) => placeSchedule.trip)
  @Column()
  tripId: number;
}
