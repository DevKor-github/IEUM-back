import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchByTextReqDto } from './dtos/search-by-text-req.dto';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPlaceImageReqDto } from './dtos/upload-place-image-req.dto';
import { PlaceImage } from 'src/entities/place-image.entity';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';

@ApiTags('장소 API')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

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

  // @ApiOperation({ summary: 'Create place by googlePlaceId' })
  // @Post('')
  // async createPlaceByGooglePlaceId(
  //   @Body() createPlaceReqDto: CreatePlaceReqDto,
  // ) {
  //   return await this.placeService.createPlaceByGooglePlaceId(
  //     createPlaceReqDto.googlePlaceId,
  //   );
  // }

  // @ApiOperation({ summary: 'Search Google Place API by text' })
  // @Post('google')
  // async getGooglePlacesByText(@Body() searchByTextReqDto: SearchByTextReqDto) {
  //   return await this.placeService.searchGooglePlacesByText(
  //     searchByTextReqDto.text,
  //   );
  // }

  // @ApiOperation({ summary: 'Get Google Place API detail by googlePlaceId' })
  // @Get('google/:googlePlaceId')
  // async getGooglePlaceDeatil(@Param('googlePlaceId') googlePlaceId: string) {
  //   return await this.placeService.getPlaceDetailByGooglePlaceId(googlePlaceId);
  // }

  @ApiOperation({ summary: 'Search KaKao Place API by keyword' })
  @ApiBody({
    schema: { type: 'object', properties: { keyword: { type: 'string' } } },
  })
  @Post('kakao')
  async getKakaoPlacesByKeyword(@Body() body: { keyword: string }) {
    return await this.placeService.searchKakaoPlaceByKeyword(body.keyword);
  }

  // @ApiOperation({ summary: 'Create placeTag' })
  // @Post('place-tags')
  // async createPlaceTag(@Body() createPlaceTagReqDto: CreatePlaceTagReqDto) {
  //   return await this.placeService.createPlaceTag(createPlaceTagReqDto);
  // }

  @CustomAuthSwaggerDecorator({
    summary: '장소 검색',
    status: 200,
    description: '장소 검색 성공',
    type: PlacePreviewResDto,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
  ])
  @Get('/:id/preview')
  async getPlacePreviewInfoById(
    @Param('id') id: number,
  ): Promise<PlacePreviewResDto> {
    return await this.placeService.getPlacePreviewInfoById(id);
  }

  // @ApiOperation({ summary: 'Create placeImage' })
  // @Post('place-images')
  // async createPlaceImage(
  //   @Body() createPlaceImageReqDto: CreatePlaceImageReqDto,
  // ) {
  //   return await this.placeService.createPlaceImage(createPlaceImageReqDto);
  // }

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
  async savePlaceImage(
    @Body() uploadPlaceImageReqDto: UploadPlaceImageReqDto,
    @UploadedFile() placeImage: Express.Multer.File,
  ) {
    return await this.placeService.savePlaceImage(
      uploadPlaceImageReqDto.placeName,
      placeImage,
    );
  }
}
