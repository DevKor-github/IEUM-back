import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/entities/trip.entity';
import { TripStyle } from 'src/entities/trip-style.entity';
import { AccommodationSchedule } from 'src/entities/accomodation-schedule.entity';
import { PlaceSchedule } from 'src/entities/place-schedule.entity';
import { TripRepository } from 'src/trip/repositories/trip.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      TripStyle,
      AccommodationSchedule,
      PlaceSchedule,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService, TripRepository],
})
export class TripModule {}
