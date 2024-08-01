import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';
import { PlaceModule } from 'src/place/place.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CollectionController],
  providers: [
    CollectionService,
    CollectionRepository,
    CollectionPlaceRepository,
  ],
  imports: [PlaceModule, UserModule],
})
export class CollectionModule {}
