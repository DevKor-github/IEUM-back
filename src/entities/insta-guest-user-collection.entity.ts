import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  Column,
} from 'typeorm';
import { InstaGuestCollection } from './insta-guest-collection.entity';
import { InstaGuestUser } from './insta-guest-user.entity';
import { Place } from './place.entity';

@Entity()
export class InstaGuestUserCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => InstaGuestUser,
    (instaGuestUser) => instaGuestUser.instaGuestUserCollections,
    { onDelete: 'CASCADE' },
  )
  instaGuestUser: InstaGuestUser;

  @RelationId(
    (instaGuestUserCollection: InstaGuestUserCollection) =>
      instaGuestUserCollection.instaGuestUser,
  )
  @Column()
  instaGuestUserId: number;

  @ManyToOne(
    () => InstaGuestCollection,
    (instaGuestCollection) => instaGuestCollection.instaGuestUserCollections,
    { onDelete: 'CASCADE' },
  )
  instaGuestCollection: InstaGuestCollection;

  @RelationId(
    (instaGuestUserCollection: InstaGuestUserCollection) =>
      instaGuestUserCollection.instaGuestCollection,
  )
  @Column()
  instaGuestCollectionId: number;
}
