import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaceTag } from '../../place/entities/place-tag.entity';
import { TagType } from 'src/common/enums/tag-type.enum';
import { FolderTag } from 'src/folder/entities/folder-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TagType, default: TagType.Custom })
  type: TagType;

  @Column()
  @Index()
  tagName: string;

  @OneToMany(() => PlaceTag, (placeTag) => placeTag.tag)
  placeTags: PlaceTag[];

  @OneToMany(() => FolderTag, (folderTag) => folderTag.tag)
  folderTags: FolderTag[];
}
