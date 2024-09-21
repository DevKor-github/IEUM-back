import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column('varchar', { array: true })
  preferredRegions: string[];

  @Column('varchar', { array: true })
  preferredCompanions: string[];

  @Column()
  cheapOrExpensive: number; //저렴한~비싼

  @Column()
  plannedOrImprovise: number; //계획적~즉흥적

  @Column()
  tightOrLoose: number; //알차게~여유롭게

  @Column()
  popularOrLocal: number; //완전 관광지~완전 로컬

  @Column()
  natureOrCity: number; //완전 자연~완전 도시

  @Column()
  restOrActivity: number; //휴양~액티비티

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
