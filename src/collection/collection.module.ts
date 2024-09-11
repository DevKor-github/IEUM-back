import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from 'src/collection/repositories/collection.repository';
import { CollectionPlaceRepository } from 'src/collection/repositories/collection-place.repository';
import { PlaceModule } from 'src/place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionPlace } from './entities/collection-place.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CollectionController],
  providers: [
    CollectionService,
    CollectionRepository,
    CollectionPlaceRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([Collection, CollectionPlace]),
    UserModule,
  ],
  exports: [CollectionService],
})
export class CollectionModule {}
