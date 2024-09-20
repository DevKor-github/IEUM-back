import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KakaoCategoryMappingService } from './kakao-category-mapping.service';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

@Controller('kakao-category-mapping')
export class KakaoCategoryMappingController {
  constructor(
    private readonly kakaoCategoryMappingService: KakaoCategoryMappingService,
  ) {}

  // ------카카오 카테고리 매핑 관련 메서드------
  @Get('/:kakaoCategory')
  async getIeumCategoryByKakaoCategory(
    @Param('kakaoCategory') kakaoCategory: string,
  ) {
    return await this.kakaoCategoryMappingService.getIeumCategoryByKakaoCategory(
      kakaoCategory,
    );
  }

  @Post('')
  async createKakaoCategoryMapping(
    @Body() body: { ieumCategory: IeumCategory; kakaoCategory: string },
  ) {
    return await this.kakaoCategoryMappingService.createKakaoCategoryMapping(
      body.ieumCategory,
      body.kakaoCategory,
    );
  }

  @Put('')
  async updateKakaoCategoryMapping(
    @Body() body: { ieumCategory: IeumCategory; kakaoCategory: string },
  ) {
    return await this.kakaoCategoryMappingService.updateKakaoCategoryMapping(
      body.ieumCategory,
      body.kakaoCategory,
    );
  }

  @Delete('/:kakaoCategory')
  async deleteKakaoCateogryMapping(
    @Param('kakaoCategory') kakaoCategory: string,
  ) {
    return await this.kakaoCategoryMappingService.deleteKakaoCategoryMapping(
      kakaoCategory,
    );
  }
}
