import { Injectable } from '@nestjs/common';
import { PlaceTag } from 'src/entities/place-tag.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceTagRepository extends Repository<PlaceTag> {
  private placeTagRepository: Repository<PlaceTag>;

  constructor(private readonly dataSource: DataSource) {
    super(PlaceTag, dataSource.createEntityManager());
  }
}
