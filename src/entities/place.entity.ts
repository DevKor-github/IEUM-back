import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaceSchedule } from './place-schedule.entity';
import { PlaceTag } from './place-tag.entity';
import { PlaceImage } from './place-image.entity';
import { FolderPlace } from './folder-place.entity';
import { InstaGuestFolder } from './insta-guest-folder.entity';
import { InstaGuestCollectionPlace } from './insta-guest-collection-place.entity';
import { PlaceDetail } from './place-detail.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  roadAddress: string;

  @Column({ nullable: true })
  kakaoId: string; //식별을 위한 kakaoId

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  primaryCategory: string; //주요 카테고리

  @Column('decimal', { nullable: true })
  latitude: number; //위도

  @Column('decimal', { nullable: true })
  longitude: number; //경도

  //인스타 게스트 컬렉션
  @OneToMany(
    () => InstaGuestCollectionPlace,
    (instaGuestCollectionPlace) => instaGuestCollectionPlace.place,
  )
  instaGuestCollectionPlaces: InstaGuestCollectionPlace[];

  //장소 스케쥴
  @OneToMany(() => PlaceSchedule, (placeSchedule) => placeSchedule.place)
  placeSchedules: PlaceSchedule[];

  //장소-태그
  @OneToMany(() => PlaceTag, (placeTag) => placeTag.place)
  placeTags: PlaceTag[];

  //장소-이미지
  @OneToMany(() => PlaceImage, (placeImage) => placeImage.place)
  placeImages: PlaceImage[];

  //폴더-장소
  @OneToMany(() => FolderPlace, (folderPlace) => folderPlace.place)
  folderPlaces: FolderPlace[];

  @OneToMany(
    () => InstaGuestFolder,
    (instaGuestFolder) => instaGuestFolder.instaGuestFolderPlaces,
  )
  instaGuestFolderPlaces: InstaGuestFolder[];

  @OneToOne(() => PlaceDetail, (placeDetail) => placeDetail.place)
  placeDetail: PlaceDetail;
}
