import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';

@Injectable()
export class TripRepository extends Repository<Trip> {
  constructor(dataSource: DataSource) {
    super(Trip, dataSource.createEntityManager());
  }
}
