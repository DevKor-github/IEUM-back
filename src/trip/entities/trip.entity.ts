import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { PlaceSchedule } from './place-schedule.entity';
import { AccommodationSchedule } from '../../common/entities/accomodation-schedule.entity';
import { User } from '../../user/entities/user.entity';
import { TripStyle } from './trip-style.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  companionCnt: number;

  @Column('varchar', { array: true })
  companionType: string[];

  @Column({ nullable: true })
  destination: string; //제주, 서울, 강릉, 양양.. 등과 같은

  @Column({ nullable: true })
  vehicle: string;

  @OneToOne(() => TripStyle, (tripStyle) => tripStyle.trip)
  tripStyle: TripStyle;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  //Accommodation Relation
  @OneToMany(
    () => AccommodationSchedule,
    (accommodationSchedule) => accommodationSchedule.trip,
  )
  accommodationSchedules: AccommodationSchedule[];

  //PlaceSchedule Relation
  @OneToMany(() => PlaceSchedule, (placeSchedule) => placeSchedule.trip)
  placeSchedules: PlaceSchedule[];

  //User Relation
  @ManyToOne(() => User, (user) => user.trips)
  user: User;

  @RelationId((trip: Trip) => trip.user)
  @Column()
  userId: number;
}
