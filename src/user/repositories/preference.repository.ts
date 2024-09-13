import { UpdateUserProfileReqDto } from '../dtos/update-user-profile-req.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Preference } from '../entities/preference.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PreferenceRepository extends Repository<Preference> {
  constructor(dataSource: DataSource) {
    super(Preference, dataSource.createEntityManager());
  }

  async updateUserPreference(
    updateUserProfileReqDto: UpdateUserProfileReqDto,
    user: User,
  ) {
    return await this.save({ ...updateUserProfileReqDto, user });
  }
}
