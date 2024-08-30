import { Injectable } from '@nestjs/common';
import { Trip } from 'src/entities/trip.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TripRepository extends Repository<Trip> {
  constructor(dataSource: DataSource) {
    super(Trip, dataSource.createEntityManager());
  }
}
