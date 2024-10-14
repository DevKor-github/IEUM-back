import { Module } from '@nestjs/common';
import { CollectionComplexController } from './collection-complex.controller';
import { CollectionComplexService } from './collection-complex.service';

@Module({
  controllers: [CollectionComplexController],
  providers: [CollectionComplexService]
})
export class CollectionComplexModule {}
