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
      description:
        '선호 지역들을 전달할 때는, 하나로 묶여있는 지역이라도 각각 따로 보내주세요. ex) 대전/충청/세종으로 묶여있더라도 "대전", "충남", "충북", "세종"을 Array로 전달',
    }),
    ApiCreatedResponse({
      description: '유저 정보 및 선호도 입력 성공',
      type: ProfileResDto,
    }),
    ApiIeumExceptionRes(['USER_NOT_FOUND']),
  ],
  deleteUser: [
    ApiOperation({ summary: '회원탈퇴' }),
    ApiOkResponse({
      description: '회원 탈퇴 성공',
    }),
    ApiIeumExceptionRes(['USER_NOT_FOUND']),
  ],
};
