import { KakaoCategoryMapping } from './entities/kakao-category-mapping.entity';
import { Injectable } from '@nestjs/common';
import { KakaoCategoryMappingRepository } from './repositories/kakao-category-mapping.repository';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

@Injectable()
export class KakaoCategoryMappingService {
  constructor(
    private readonly kakaoCategoryMappingRepository: KakaoCategoryMappingRepository,
  ) {}

  async getIeumCategoryByKakaoCategory(
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    return await this.kakaoCategoryMappingRepository.getIeumCategoryByKakaoCategory(
      kakaoCategory,
    );
  }

  async getKakaoCategoriesByIeumCategory(
    ieumCategory: IeumCategory,
  ): Promise<KakaoCategoryMapping[]> {
    return await this.kakaoCategoryMappingRepository.getKakaoCategoriesByIeumCategory(
      ieumCategory,
    );
  }

  async createKakaoCategoryMapping(
    ieumCategory: IeumCategory,
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    return await this.kakaoCategoryMappingRepository.createKakaoCategoryMapping(
      ieumCategory,
      kakaoCategory,
    );
  }

  async updateKakaoCategoryMapping(
    ieumCategory: IeumCategory,
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    return await this.kakaoCategoryMappingRepository.updateKakaoCategoryMapping(
      ieumCategory,
      kakaoCategory,
    );
  }

  async deleteKakaoCategoryMapping(
    kakaoCategory: string,
  ): Promise<KakaoCategoryMapping> {
    return await this.kakaoCategoryMappingRepository.deleteKakaoCategoryMapping(
      kakaoCategory,
    );
  }
}
