import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  private tagRepository: Repository<Tag>;

  constructor(private readonly dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
}
