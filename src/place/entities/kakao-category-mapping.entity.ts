import { IeumCategory } from 'src/common/enums/ieum-category.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class KakaoCategoryMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kakaoCategory: string;

  @Column({ type: 'enum', enum: IeumCategory })
  ieumCategory: IeumCategory;
}
