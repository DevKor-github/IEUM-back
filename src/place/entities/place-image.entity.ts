import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Place } from './place.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PlaceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Place, (place) => place.placeImages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  place: Place | null;

  @RelationId((placeImage: PlaceImage) => placeImage.place)
  @Column()
  placeId: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  authorName: string;

  @Column({ nullable: true })
  authorUri: string;
}
