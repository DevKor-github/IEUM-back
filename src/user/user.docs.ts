import { MethodNames } from 'src/common/types/method-names.type';
import { UserController } from './user.controller';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NickNameDuplicateCheckResDto } from './dtos/nickname-dupliate-check-res.dto';
import { ProfileResDto } from './dtos/profile-res.dto';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';

type UserMethodNames = MethodNames<UserController>;

export const UserDocs: Record<UserMethodNames, MethodDecorator[]> = {
  checkDuplicateNickName: [
    ApiOperation({ summary: '닉네임 중복 확인.' }),
    ApiOkResponse({
      description: '닉네임 중복 여부 반환: true= 중복됨, false= 중복안됨',
      type: NickNameDuplicateCheckResDto,
    }),
  ],
  getUserProfile: [
    ApiOperation({ summary: '유저 프로필 불러오기.' }),
    ApiOkResponse({
      description: '유저 프로필 불러오기 성공',
      type: ProfileResDto,
    }),
    ApiIeumExceptionRes(['USER_NOT_FOUND']),
  ],
  updateUserProfile: [
    ApiOperation({
      summary: '유저 프로필 변경',
      description: `
      동반자 정보(preferredCompanions)는 보낼 수 있는 타입이 정해져있습니다!
      Swagger 하단 Schema 정보에서 UpdateUserProfileReqDto를 확인해주세요.

      선호 지역 정보는 Array로 전달해주세요. 

      변경하지 않을 항목이 있다면, GET /users/me로 불러온 정보를 그대로 전달해주세요.`,
    }),
    ApiCreatedResponse({
      description: '유저 정보 및 선호도 입력 성공',
      type: ProfileResDto,
    }),
    ApiIeumExceptionRes(['USER_NOT_FOUND', 'DUPLICATED_NICKNAME']),
  ],
  deleteUser: [
    ApiOperation({ summary: '회원탈퇴' }),
    ApiOkResponse({
      description: '회원 탈퇴 성공',
    }),
    ApiIeumExceptionRes(['USER_NOT_FOUND']),
  ],
};
