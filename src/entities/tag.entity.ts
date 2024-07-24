import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlaceTag } from './place-tag.entity';
import { FolderTag } from './folder-tag.entity';
import { TagType } from 'src/common/enums/tag-type.enum';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TagType, default: TagType.Custom })
  type: TagType;

  @Column()
  tagName: string;

  @OneToMany(() => PlaceTag, (placeTag) => placeTag.tag)
  placeTags: PlaceTag[];

  @OneToMany(() => FolderTag, (folderTag) => folderTag.tag)
  folderTags: FolderTag[];
}
