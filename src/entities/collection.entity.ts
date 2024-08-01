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
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column({ nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: CollectionType,
    default: CollectionType.INSTAGRAM,
  })
  collectionType: CollectionType;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @RelationId((collection: Collection) => collection.user)
  @Exclude()
  @Column()
  userId: number;

  @OneToMany(
    () => CollectionPlace,
    (collectionPlace) => collectionPlace.collection,
  )
  collectionPlaces: CollectionPlace[];

  @Column({ default: false })
  isViewed: boolean;
}
