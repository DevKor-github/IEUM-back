import { Module } from '@nestjs/common';
import { PlaceComplexController } from './place-complex.controller';
import { PlaceComplexService } from './place-complex.service';
import { PlaceModule } from 'src/place/place.module';
import { UserModule } from 'src/user/user.module';
import { CollectionModule } from 'src/collection/collection.module';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [PlaceModule, CollectionModule, FolderModule, UserModule],
  controllers: [PlaceComplexController],
  providers: [PlaceComplexService],
})
export class PlaceComplexModule {}
