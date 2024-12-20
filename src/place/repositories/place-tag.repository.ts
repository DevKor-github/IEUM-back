import { Injectable } from '@nestjs/common';
import { PlaceTag } from 'src/place/entities/place-tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceTagRepository extends Repository<PlaceTag> {
  constructor(private readonly dataSource: DataSource) {
    super(PlaceTag, dataSource.createEntityManager());
  }
}
