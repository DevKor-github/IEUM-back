import { Place } from './place.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  RelationId,
} from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
export class PlaceTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Place, (place) => place.placeTags, { onDelete: 'CASCADE' })
  place: Place;

  @RelationId((placeTag: PlaceTag) => placeTag.place)
  @Column()
  placeId: number;

  @ManyToOne(() => Tag, (tag) => tag.placeTags, { onDelete: 'CASCADE' })
  tag: Tag;

  @RelationId((placeTag: PlaceTag) => placeTag.tag)
  @Column()
  tagId: number;
}
