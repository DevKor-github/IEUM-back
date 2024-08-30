import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
  private tagRepository: Repository<Tag>;

  constructor(private readonly dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
}
