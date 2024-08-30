import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class AccommodationSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  //Trip Relation
  @ManyToOne(() => Trip, (trip) => trip.accommodationSchedules, {
    onDelete: 'CASCADE',
  })
  trip: Trip;

  @RelationId(
    (accommodationSchedule: AccommodationSchedule) =>
      accommodationSchedule.trip,
  )
  @Column()
  tripId: number;
}
