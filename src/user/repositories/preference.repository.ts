import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPreferenceDto } from 'src/user/dtos/first-login.dto';
import { Preference } from '../entities/preference.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PreferenceRepository extends Repository<Preference> {
  constructor(dataSource: DataSource) {
    super(Preference, dataSource.createEntityManager());
  }

  async fillUserPreference(userPreferenceDto: UserPreferenceDto, id: number) {
    const user = new User();
    user.id = id;
    const userPreference = this.create({ ...userPreferenceDto, user });
    return await this.save(userPreference);
  }
}
