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
import { UserCurationCollection } from './user-curation-collection.entity';
import { Preference } from './preference.entity';
import { CollectionsFolder } from './collections-folder.entity';
import { OAuthPlatform } from 'src/common/enums/oAuth-platform.enum';

@Entity()
export class User {
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

  @Column({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @OneToMany(
    () => UserCurationCollection,
    (userCurationCollection) => userCurationCollection.user,
  )
  userCurationCollections: UserCurationCollection[];

  @OneToOne(() => Preference, (preference) => preference.user)
  preference: Preference;

  @OneToMany(
    () => CollectionsFolder,
    (collectionsFolder) => collectionsFolder.user,
  )
  collectionsFolders: CollectionsFolder[];
}
