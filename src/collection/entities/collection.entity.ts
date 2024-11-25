import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { CollectionPlace } from './collection-place.entity';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity } from 'src/entities/base-entity.entity';

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

  @ManyToOne(() => User, (user) => user.collections, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: User;

  @RelationId((collection: Collection) => collection.user)
  @Exclude()
  @Column({ nullable: true })
  userId: number;

  @OneToMany(
    () => CollectionPlace,
    (collectionPlace) => collectionPlace.collection,
  )
  collectionPlaces: CollectionPlace[];

  @Column({ default: false })
  isViewed: boolean;
}
