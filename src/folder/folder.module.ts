import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { FolderRepository } from 'src/folder/repositories/folder.repository';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';

@Module({
  controllers: [FolderController],
  providers: [FolderService, FolderRepository, FolderPlaceRepository],
  exports: [FolderService],
})
export class FolderModule {}
