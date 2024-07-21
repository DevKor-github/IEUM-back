import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from 'src/repositories/place.repository';
import { OpenHoursRepository } from 'src/repositories/open-hours.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { PlaceCategoryRepository } from 'src/repositories/place-category.repository';
import { PlaceTagRepository } from 'src/repositories/place-tag.repository';
import { PlaceImageRepository } from 'src/repositories/place-image.repository';
import { AddressComponentsRepository } from 'src/repositories/address-components.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  controllers: [PlaceController],
  providers: [
    PlaceService,
    PlaceRepository,
    OpenHoursRepository,
    CategoryRepository,
    PlaceCategoryRepository,
    PlaceTagRepository,
    PlaceImageRepository,
    AddressComponentsRepository,
    UserRepository,
  ],
  exports: [PlaceService],
})
export class PlaceModule {}
