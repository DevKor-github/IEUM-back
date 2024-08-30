import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePlaceImageReqDto } from './dtos/create-place-image-req.dto';
import { PlaceImage } from 'src/place/entities/place-image.entity';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { Place } from './entities/place.entity';

@ApiTags('장소 API')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: '장소명으로 DB 내의 장소 검색' })
  @ApiQuery({ name: 'placeName', type: 'string' })
  @Get()
  async getPlacesByPlaceName(
    @Query('placeName') placeName: string,
  ): Promise<Place[]> {
    return await this.placeService.getPlacesByPlaceName(placeName);
  }

  @CustomAuthSwaggerDecorator({
    summary: '특정 장소의 상세 정보 조회',
    status: 200,
    description: '특정 장소의 상세 정보 조회 성공',
    type: PlaceDetailResDto,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
  ])
  @Get(':placeId')
  async getPlaceDetailById(@Param('placeId') placeId: string) {
    return await this.placeService.getPlaceDetailById(parseInt(placeId));
  }

  @CustomAuthSwaggerDecorator({
    summary: '특정 장소의 프리뷰 검색',
    status: 200,
    description: '특정 장소의 프리뷰 검색 성공',
    type: PlacePreviewResDto,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
  ])
  @Get('/:placeId/preview')
  async getPlacePreviewInfoById(
    @Param('placeId') placeId: string,
  ): Promise<PlacePreviewResDto> {
    return await this.placeService.getPlacePreviewInfoById(parseInt(placeId));
  }

  @ApiOperation({ summary: '키워드로 카카오 Place API 검색' })
  @ApiQuery({ name: 'keyword', type: 'string' })
  @Get('kakao')
  async getKakaoPlacesByKeyword(@Query() keyword: string) {
    return await this.placeService.searchKakaoLocalByKeyword(keyword);
  }

  @ApiOperation({ summary: '장소 이미지 저장' })
  @ApiResponse({
    status: 201,
    description: '장소 이미지 저장 성공',
    type: PlaceImage,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
    {
      statusCode: ErrorCodeEnum.BadRequestImageFile,
      message: '파일이 업로드 되지 않았거나 파일명이 존재하지 않음.',
    },
    {
      statusCode: ErrorCodeEnum.AWSS3Error,
      message: 'S3에 파일 업로드 중 문제 발생.',
    },
  ])
  @ApiOperation({ summary: '장소 사진 장소명으로 저장' })
  @UseInterceptors(FileInterceptor('placeImage'))
  @ApiConsumes('multipart/form-data')
  @Post('/image')
  async createPlaceImage(
    @Body() createPlaceImageReqDto: CreatePlaceImageReqDto,
    @UploadedFile() placeImage: Express.Multer.File,
  ) {
    return await this.placeService.createPlaceImage(
      createPlaceImageReqDto.placeId,
      placeImage,
    );
  }
}
