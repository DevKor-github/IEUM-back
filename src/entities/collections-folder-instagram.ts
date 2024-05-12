import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { InstaGuestCollection } from './insta-guest-collection.entity';
import { CollectionsFolder } from './collections-folder.entity';

@Entity()
export class CollectionsFolderInstagram {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => CollectionsFolder,
    (collectionsFolder) => collectionsFolder.collectionsFolderInstagrams,
  )
  collectionsFolder: CollectionsFolder;

  @RelationId(
    (collectionsFolderInstagram: CollectionsFolderInstagram) =>
      collectionsFolderInstagram.collectionsFolder,
  )
  @Column()
  collectionsFolderId: number;

  @ManyToOne(() => InstaGuestCollection)
  instaGuestCollection: InstaGuestCollection;

  @RelationId(
    (collectionsFolderInstagram: CollectionsFolderInstagram) =>
      collectionsFolderInstagram.instaGuestCollection,
  )
  @Column()
  instaGuestCollectionId: number;
}
