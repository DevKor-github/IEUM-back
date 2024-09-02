import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity()
export class TripStyle {
  @PrimaryGeneratedColumn()
  id: number;
  //동선 추천을 위한 여행 스타일
  @Column() //숙소 위치
  accomodotionLocation: string;

  @Column()
  budgetStyle: number; //저렴한~비싼

  @Column()
  planningStyle: number; //계획적~즉흥적

  @Column()
  scheduleStyle: number; //알차게~여유롭게

  @Column()
  destinationStyle1: number; //완전 관광지~완전 로컬

  @Column()
  destinationStyle2: number; //완전 자연~완전 도시

  @Column()
  destinationStyle3: number; //휴양~액티비티

  @OneToOne(() => Trip, (trip) => trip.tripStyle, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: Trip;
}
