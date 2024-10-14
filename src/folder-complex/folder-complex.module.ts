import { Module } from '@nestjs/common';
import { FolderComplexController } from './folder-complex.controller';
import { FolderComplexService } from './folder-complex.service';

@Module({
  controllers: [FolderComplexController],
  providers: [FolderComplexService]
})
export class FolderComplexModule {}
