import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripRepository } from 'src/trip/repositories/trip.repository';
import { Trip } from './entities/trip.entity';
import { TripStyle } from './entities/trip-style.entity';
import { AccommodationSchedule } from './entities/accomodation-schedule.entity';
import { PlaceSchedule } from './entities/place-schedule.entity';

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
  exports: [TripService],
})
export class TripModule {}
