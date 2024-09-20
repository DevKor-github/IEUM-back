import { Injectable } from '@nestjs/common';
import { KakaoCategoryMapping } from '../entities/kakao-category-mapping.entity';
import { DataSource, Repository } from 'typeorm';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

@Injectable()
export class KakaoCategoryMappingRepository extends Repository<KakaoCategoryMapping> {
  constructor(private readonly dataSource: DataSource) {
    super(KakaoCategoryMapping, dataSource.createEntityManager());
  }

  async getIeumCategoryByKakaoCategory(
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    return await this.createQueryBuilder('kakaoCategoryMapping')
      .where('kakaoCategoryMapping.kakaoCategory = :kakaoCategory', {
        kakaoCategory,
      })
      .getOne();
  }

  async getKakaoCategoriesByIeumCategory(
    ieumCategory: IeumCategory,
  ): Promise<KakaoCategoryMapping[]> {
    return await this.createQueryBuilder('kakaoCategoryMapping')
      .where('kakaoCategoryMapping.ieumCategory = :ieumCategory', {
        ieumCategory,
      })
      .getMany();
  }

  async createKakaoCategoryMapping(
    ieumCategory: IeumCategory,
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    const kakaoCategoryMapping = new KakaoCategoryMapping();
    kakaoCategoryMapping.ieumCategory = ieumCategory;
    kakaoCategoryMapping.kakaoCategory = kakaoCategory;
    return await this.save(kakaoCategoryMapping);
  }

  async updateKakaoCategoryMapping(
    ieumCategory: IeumCategory,
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    const kakaoCategoryMapping =
      await this.getIeumCategoryByKakaoCategory(kakaoCategory);
    kakaoCategoryMapping.ieumCategory = ieumCategory;
    return await this.save(kakaoCategoryMapping);
  }

  async deleteKakaoCategoryMapping(
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    const kakaoCategoryMapping =
      await this.getIeumCategoryByKakaoCategory(kakaoCategory);
    return await this.remove(kakaoCategoryMapping);
  }
}
