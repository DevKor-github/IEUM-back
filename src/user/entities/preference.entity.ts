import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { array: true })
  preferredRegion: string[];

  @Column('varchar', { array: true })
  preferredCompanion: string[];

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

  @OneToOne(() => User, (user) => user.preference)
  @JoinColumn()
  user: User;
}
