import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagRepository } from 'src/tag/tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagService],
})
export class TagModule {}
