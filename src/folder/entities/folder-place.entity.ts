import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Folder } from './folder.entity';
import { Place } from 'src/place/entities/place.entity';

@Entity()
export class FolderPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Folder, (folder) => folder.folderPlaces, {
    onDelete: 'CASCADE',
  })
  folder: Folder;

  @RelationId((folderPlace: FolderPlace) => folderPlace.folder)
  @Column()
  folderId: number;

  @ManyToOne(() => Place, (place) => place.folderPlaces)
  place: Place;

  @RelationId((folderPlace: FolderPlace) => folderPlace.place)
  @Column()
  placeId: number;
}
