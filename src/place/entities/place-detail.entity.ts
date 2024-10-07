import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';

@Entity()
export class PlaceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { array: true, nullable: true })
  weekDaysOpeningHours: string[]; //영업시간

  @Column({ nullable: true })
  freeParkingLot: boolean;

  @Column({ nullable: true })
  paidParkingLot: boolean;

  @Column({ nullable: true })
  freeStreetParking: boolean;

  @Column({ nullable: true })
  allowsDogs: boolean; //반려동물 동반 여부

  @Column({ nullable: true })
  goodForGroups: boolean; //단체석 여부

  @Column({ nullable: true })
  reservable: boolean; //포장 여부

  @Column({ nullable: true })
  delivery: boolean; //배달 여부

  @Column({ nullable: true })
  takeout: boolean; //예약 가능 여부

  @Column({ nullable: true })
  googleMapsUri: string;

  @OneToOne(() => Place, (place) => place.placeDetail, { onDelete: 'CASCADE' })
  @JoinColumn()
  place: Place;
}
