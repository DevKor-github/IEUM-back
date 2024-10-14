import { Module } from '@nestjs/common';
import { CollectionComplexController } from './collection-complex.controller';
import { CollectionComplexService } from './collection-complex.service';
import { CollectionModule } from 'src/collection/collection.module';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [CollectionModule, UserModule, PlaceModule, FolderModule],
  controllers: [CollectionComplexController],
  providers: [CollectionComplexService],
})
export class CollectionComplexModule {}
