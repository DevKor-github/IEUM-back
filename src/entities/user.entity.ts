import {
  Column,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { InstaGuestUser } from './insta-guest-user.entity';
import { Trip } from './trip.entity';
import { Preference } from './preference.entity';
import { Folder } from './folder.entity';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';
import { BasicDate } from './basic-date.entity';
import { UserCurationLike } from './user-curation-like.entity';

@Entity()
export class User extends BasicDate {
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

  @Column({ nullable: true })
  instaGuestUserId: number;

  @Column('varchar', { nullable: true })
  refreshToken: string;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @OneToOne(() => Preference, (preference) => preference.user)
  preference: Preference;

  @OneToMany(() => Folder, (Folder) => Folder.user)
  folders: Folder[];

  @OneToMany(
    () => UserCurationLike,
    (userCurationLike) => userCurationLike.user,
  )
  userCurationLikes: UserCurationLike[];
}
