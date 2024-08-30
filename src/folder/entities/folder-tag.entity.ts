import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Folder } from './folder.entity';
import { Tag } from './tag.entity';

@Entity()
export class FolderTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Folder, (folder) => folder.folderTags)
  folder: Folder;

  @RelationId((folderTag: FolderTag) => folderTag.folder)
  @Column()
  folderId: number;

  @ManyToOne(() => Tag, (tag) => tag.folderTags)
  tag: Tag;

  @RelationId((folderTag: FolderTag) => folderTag.tag)
  @Column()
  tagId: number;
}
