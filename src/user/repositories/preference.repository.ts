import { FirstLoginReqDto } from 'src/user/dtos/first-login.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Preference } from '../entities/preference.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PreferenceRepository extends Repository<Preference> {
  constructor(dataSource: DataSource) {
    super(Preference, dataSource.createEntityManager());
  }

  async fillUserPreference(firstLoginReqDto: FirstLoginReqDto, user: User) {
    return await this.save({ ...firstLoginReqDto, user });
  }
}
