import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { FolderRepository } from 'src/folder/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { FolderPlace } from './entities/folder-place.entity';
import { FolderTag } from './entities/folder-tag.entity';
import { UserModule } from 'src/user/user.module';
import { PlaceModule } from 'src/place/place.module';

@Module({
  controllers: [FolderController],
  providers: [FolderService, FolderRepository, FolderPlaceRepository],
  imports: [
    TypeOrmModule.forFeature([Folder, FolderPlace, FolderTag]),
    UserModule,
  ],
  exports: [FolderService],
})
export class FolderModule {}
