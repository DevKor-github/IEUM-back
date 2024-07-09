import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Place } from './place.entity';

@Entity()
export class PlaceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber: string; //전화번호

  @Column({ nullable: true })
  websiteUrl: string; //홈페이지

  @Column('jsonb', { nullable: true })
  parkingOptions: JSON; //주차 여부.. json으로 저장?

  @Column({ nullable: true })
  allowsDogs: string; //반려동물 동반 여부

  @Column({ nullable: true })
  goodForGroups: string; //단체석 여부

  @Column({ nullable: true })
  reservable: string; //포장 여부

  @Column({ nullable: true })
  delivery: string; //배달 여부

  @Column({ nullable: true })
  takeout: string; //예약 가능 여부

  @OneToOne(() => Place, (place) => place.placeDetail)
  @JoinColumn()
  place: Place;
}
