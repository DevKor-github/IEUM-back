import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Folder } from './folder.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Entity()
export class FolderTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Folder, (folder) => folder.folderTags, {
    onDelete: 'CASCADE',
  })
  folder: Folder;

  @RelationId((folderTag: FolderTag) => folderTag.folder)
  @Column()
  folderId: number;

  @ManyToOne(() => Tag, (tag) => tag.folderTags, { onDelete: 'CASCADE' })
  tag: Tag;

  @RelationId((folderTag: FolderTag) => folderTag.tag)
  @Column()
  tagId: number;
}
