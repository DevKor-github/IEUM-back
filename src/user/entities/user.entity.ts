import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';
import { Folder } from '../../folder/entities/folder.entity';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import { Preference } from './preference.entity';
import { Collection } from 'src/collection/entities/collection.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'enum', enum: OAuthPlatform })
  oAuthPlatform: OAuthPlatform;

  @Column()
  oAuthId: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column('char', { length: 1, nullable: true })
  sex: string;

  @Column('varchar', { length: 4, nullable: true })
  mbti: string;

  @Column('varchar', { nullable: true })
  jti: string;

  @Column({ nullable: true })
  fcmToken: string;

  @Column('boolean', { default: false })
  isAdConfirmed: boolean;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @OneToOne(() => Preference, (preference) => preference.user)
  preference: Preference;

  @OneToMany(() => Folder, (Folder) => Folder.user)
  folders: Folder[];

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];
}
