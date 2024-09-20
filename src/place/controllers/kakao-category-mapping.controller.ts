import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { KakaoCategoryMappingDocs } from '../docs/kakao-category-mapping.docs';
import { KakaoCategoryMappingReqDto } from '../dtos/kakao-category-mapping-req.dto';
import { KakaoCategoryMappingService } from '../services/kakao-category-mapping.service';

@ApplyDocs(KakaoCategoryMappingDocs)
@ApiTags('카테고리 매핑 API')
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
    @Body() createKakaoCategoryMappingReq: KakaoCategoryMappingReqDto,
  ) {
    return await this.kakaoCategoryMappingService.createKakaoCategoryMapping(
      createKakaoCategoryMappingReq.ieumCategory,
      createKakaoCategoryMappingReq.kakaoCategory,
    );
  }

  @Put('')
  async updateKakaoCategoryMapping(
    @Body() updateKakaoCategoryMappingReq: KakaoCategoryMappingReqDto,
  ) {
    return await this.kakaoCategoryMappingService.updateKakaoCategoryMapping(
      updateKakaoCategoryMappingReq.ieumCategory,
      updateKakaoCategoryMappingReq.kakaoCategory,
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
