import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';

@Module({
  controllers: [CollectionController],
  providers: [
    CollectionService,
    CollectionRepository,
    CollectionPlaceRepository,
  ],
})
export class CollectionModule {}
