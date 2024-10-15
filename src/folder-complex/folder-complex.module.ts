import { Module } from '@nestjs/common';
import { FolderComplexController } from './folder-complex.controller';
import { FolderComplexService } from './folder-complex.service';
import { FolderModule } from 'src/folder/folder.module';
import { PlaceModule } from 'src/place/place.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FolderModule, PlaceModule, UserModule],
  controllers: [FolderComplexController],
  providers: [FolderComplexService],
})
export class FolderComplexModule {}
