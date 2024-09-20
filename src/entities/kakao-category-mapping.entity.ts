import { IeumCategories } from 'src/common/utils/category-mapper.util';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class KakaoCategoryMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kakaoCategory: string;

  @Column({ type: 'enum', enum: IeumCategories })
  ieumCategory: IeumCategories;
}
