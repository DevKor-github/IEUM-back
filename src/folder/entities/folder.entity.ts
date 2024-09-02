import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { FolderPlace } from './folder-place.entity';
import { FolderTag } from './folder-tag.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.folders)
  user: User;

  @Exclude()
  @RelationId((Folder: Folder) => Folder.user)
  @Column()
  userId: number;

  @Column({ type: 'enum', enum: FolderType, default: FolderType.Custom })
  type: FolderType;

  @OneToMany(() => FolderPlace, (folderPlace) => folderPlace.folder)
  folderPlaces: FolderPlace[];

  @OneToMany(() => FolderTag, (folderTag) => folderTag.folder)
  folderTags: FolderTag[];
}
