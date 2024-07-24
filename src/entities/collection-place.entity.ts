import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  Column,
} from 'typeorm';

import { Place } from './place.entity';
import { Collection } from './collection.entity';

@Entity()
export class CollectionPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Collection, (collection) => collection.collectionPlaces)
  collection: Collection;

  @RelationId((collectionPlace: CollectionPlace) => collectionPlace.collection)
  @Column()
  collectionId: number;

  @ManyToOne(() => Place, (place) => place.collectionPlaces)
  place: Place;

  @RelationId((collectionPlace: CollectionPlace) => collectionPlace.place)
  @Column()
  placeId: number;

  @Column({ default: false })
  isSaved: boolean;

  @Column()
  placeKeyword: string;
}
