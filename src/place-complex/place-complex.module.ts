import { Module } from '@nestjs/common';
import { PlaceComplexController } from './place-complex.controller';
import { PlaceComplexService } from './place-complex.service';

@Module({
  controllers: [PlaceComplexController],
  providers: [PlaceComplexService]
})
export class PlaceComplexModule {}
