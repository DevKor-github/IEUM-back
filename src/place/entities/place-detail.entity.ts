import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Place } from '../../common/entities/place.entity';

@Entity()
export class PlaceDetail {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('varchar', { array: true })
  opening: string[]; //영업시간

  @OneToOne(() => Place, (place) => place.placeDetail)
  @JoinColumn()
  place: Place;
}
