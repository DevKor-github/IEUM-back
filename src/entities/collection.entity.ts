import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';
import { CollectionPlace } from './collection-place.entity';
import { BaseEntity } from './base-entity.entity';
import { User } from './user.entity';

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  embeddedTag: string;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @RelationId((collection: Collection) => collection.user)
  userId: number;

  @OneToMany(
    () => CollectionPlace,
    (collectionPlace) => collectionPlace.collection,
  )
  collectionPlaces: CollectionPlace[];

  @Column({ default: false })
  isViewed: boolean;
}
