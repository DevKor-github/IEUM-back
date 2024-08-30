import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  Column,
} from 'typeorm';

import { Place } from '../../place/entities/place.entity';
import { Collection } from './collection.entity';

@Entity()
export class CollectionPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Collection, (collection) => collection.collectionPlaces, {
    onDelete: 'CASCADE',
  })
  collection: Collection;

  @RelationId((collectionPlace: CollectionPlace) => collectionPlace.collection)
  @Column()
  collectionId: number;

  @ManyToOne(() => Place, (place) => place.collectionPlaces, {
    onDelete: 'CASCADE',
  })
  place: Place;

  @RelationId((collectionPlace: CollectionPlace) => collectionPlace.place)
  @Column()
  placeId: number;

  @Column({ default: false })
  isSaved: boolean;

  @Column()
  placeKeyword: string;
}
