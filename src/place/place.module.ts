import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from 'src/place/repositories/place.repository';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/place/repositories/place-image.repository';
import { PlaceDetailRepository } from 'src/repositories/place-detail.repository';
import { TagModule } from 'src/tag/tag.module';
import { S3Service } from 'src/place/s3.service';

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
  imports: [TagModule],
  exports: [PlaceService],
})
export class PlaceModule {}
