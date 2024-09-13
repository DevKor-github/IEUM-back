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
    let preference = user.preference;
    if (!preference) {
      preference = new Preference();
      preference.user = user;
    }

    preference.preferredCompanions =
      updateUserProfileReqDto.preferredCompanions;
    preference.preferredRegions = updateUserProfileReqDto.preferredRegions;

    preference.restOrActivity = updateUserProfileReqDto.restOrActivity;
    preference.cheapOrExpensive = updateUserProfileReqDto.cheapOrExpensive;
    preference.natureOrCity = updateUserProfileReqDto.natureOrCity;
    preference.plannedOrImprovise = updateUserProfileReqDto.plannedOrImprovise;
    preference.popularOrLocal = updateUserProfileReqDto.popularOrLocal;
    preference.tightOrLoose = updateUserProfileReqDto.tightOrLoose;

    return await this.save(preference);
  }
}
