import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  Column,
} from 'typeorm';
import { InstaGuestUser } from './insta-guest-user.entity';
import { Place } from './place.entity';
import { InstaGuestCollection } from './insta-guest-collection.entity';

@Entity()
export class InstaGuestCollectionPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => InstaGuestCollection,
    (instaGuestCollection) => instaGuestCollection.instaGuestCollectionPlaces,
    { onDelete: 'CASCADE' },
  )
  instaGuestCollection: InstaGuestCollection;

  @RelationId(
    (instaGuestCollectionPlace: InstaGuestCollectionPlace) =>
      instaGuestCollectionPlace.instaGuestCollection,
  )
  @Column()
  instaGuestCollectionId: number;

  @ManyToOne(() => Place, (place) => place.instaGuestCollectionPlaces, {
    onDelete: 'CASCADE',
  })
  place: Place;

  @RelationId(
    (instaGuestCollectionPlace: InstaGuestCollectionPlace) =>
      instaGuestCollectionPlace.place,
  )
  @Column()
  placeId: number;
}
