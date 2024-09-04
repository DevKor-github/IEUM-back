import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from 'src/place/repositories/place.repository';
import { PlaceImageRepository } from 'src/place/repositories/place-image.repository';
import { TagModule } from 'src/tag/tag.module';
import { S3Service } from 'src/place/s3.service';
import { PlaceTagRepository } from './repositories/place-tag.repository';
import { PlaceDetailRepository } from './repositories/place-detail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlaceDetail } from './entities/place-detail.entity';
import { PlaceImage } from './entities/place-image.entity';
import { PlaceTag } from './entities/place-tag.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PlaceController],
  providers: [
    PlaceService,
    PlaceRepository,
    PlaceTagRepository,
    PlaceImageRepository,
    PlaceDetailRepository,
    S3Service,
  ],
  imports: [
    UserModule,
    TagModule,
    TypeOrmModule.forFeature([Place, PlaceDetail, PlaceImage, PlaceTag]),
  ],
  exports: [PlaceService],
})
export class PlaceModule {}
