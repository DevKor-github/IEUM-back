import { Module } from '@nestjs/common';
import { PlaceController } from './controllers/place.controller';
import { PlaceService } from './services/place.service';
import { PlaceRepository } from 'src/place/repositories/place.repository';
import { PlaceImageRepository } from 'src/place/repositories/place-image.repository';
import { TagModule } from 'src/tag/tag.module';
import { S3Service } from 'src/place/services/s3.service';
import { PlaceTagRepository } from './repositories/place-tag.repository';
import { PlaceDetailRepository } from './repositories/place-detail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlaceDetail } from './entities/place-detail.entity';
import { PlaceImage } from './entities/place-image.entity';
import { PlaceTag } from './entities/place-tag.entity';
import { UserModule } from 'src/user/user.module';
import { CollectionModule } from 'src/collection/collection.module';
import { KakaoCategoryMapping } from './entities/kakao-category-mapping.entity';
import { KakaoCategoryMappingRepository } from './repositories/kakao-category-mapping.repository';
import { KakaoCategoryMappingController } from './controllers/kakao-category-mapping.controller';
import { KakaoCategoryMappingService } from './services/kakao-category-mapping.service';

@Module({
  controllers: [PlaceController, KakaoCategoryMappingController],
  providers: [
    PlaceService,
    PlaceRepository,
    PlaceTagRepository,
    PlaceImageRepository,
    PlaceDetailRepository,
    S3Service,
    KakaoCategoryMappingService,
    KakaoCategoryMappingRepository,
  ],
  imports: [
    UserModule,
    TagModule,
    TypeOrmModule.forFeature([
      Place,
      PlaceDetail,
      PlaceImage,
      PlaceTag,
      KakaoCategoryMapping,
    ]),
  ],
  exports: [PlaceService, KakaoCategoryMappingService],
})
export class PlaceModule {}
