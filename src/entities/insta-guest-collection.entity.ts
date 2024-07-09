import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { InstaGuestUser } from './insta-guest-user.entity';
import { Place } from './place.entity';
import { InstaGuestCollectionPlace } from './insta-guest-collection-place.entity';
import { InstaGuestUserCollection } from './insta-guest-user-collection.entity';

@Entity()
export class InstaGuestCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => InstaGuestUserCollection,
    (instaGuestUserCollection) => instaGuestUserCollection.instaGuestCollection,
  )
  instaGuestUserCollections: InstaGuestUserCollection[];

  //Place에 Many To One
  @OneToMany(
    () => InstaGuestCollectionPlace,
    (instaGuestCollectionPlace) =>
      instaGuestCollectionPlace.instaGuestCollection,
  )
  instaGuestCollectionPlaces: InstaGuestCollectionPlace[];

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  embeddedTag: string;
}
