import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CurationPlace } from './curation-place.entity';
import { BasicDate } from './basic-date.entity';
import { CurationTag } from './curation-tag.entity';
import { UserCurationLike } from './user-curation-like.entity';

@Entity()
export class Curation extends BasicDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  viewCount: number;

  @Column()
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @RelationId((curation: Curation) => curation.user)
  @Column()
  userId: number;

  @OneToMany(() => CurationPlace, (curationPlace) => curationPlace.curation)
  curationPlaces: CurationPlace[];

  @OneToMany(() => CurationTag, (curationTag) => curationTag.curation)
  curationTags: CurationTag[];

  @OneToMany(
    () => UserCurationLike,
    (userCurationLike) => userCurationLike.curation,
  )
  userCurationLikes: UserCurationLike[];
}
