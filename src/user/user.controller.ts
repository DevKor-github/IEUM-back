import {
  Controller,
  Post,
  Body,
  Req,
  Put,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirstLoginReqDto, FirstLoginResDto } from './dtos/first-login.dto';
import { UserService } from './user.service';
import { NickNameDuplicateCheckResDto } from './dtos/nickname-dupliate-check-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';

@ApiTags('유저 API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '닉네임 중복 확인.' })
  @ApiResponse({
    status: 200,
    description: '닉네임 중복 여부 반환: true= 중복됨, false= 중복안됨',
    type: NickNameDuplicateCheckResDto,
  })
  @Get('/nickname')
  async checkDuplicateNickName(
    @Query('nickname') nickname: string,
  ): Promise<NickNameDuplicateCheckResDto> {
    return this.userService.checkDuplicateNickName(nickname);
  }

  //최초 로그인시 유저 정보 받아오기.
  @CustomAuthSwaggerDecorator({
    summary: '최초 유저 정보 기입',
    status: 201,
    description: '유저 정보 입력 성공',
    type: FirstLoginResDto,
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidUser,
      message: '해당 유저가 존재하지 않음.',
    },
  ])
  @Put('/me/info')
  async fillUserInfoAndPreference(
    @Body() firstLoginReqDto: FirstLoginReqDto,
    @Req() req,
  ): Promise<FirstLoginResDto> {
    return await this.userService.fillUserInfoAndPreference(
      firstLoginReqDto,
      req.user.id,
    );
  }

  @CustomAuthSwaggerDecorator({
    summary: '회원탈퇴',
    status: 200,
    description: '회원 탈퇴 성공',
  })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidUser,
      message: '해당 유저가 존재하지 않음.',
    },
  ])
  @Delete('/me')
  async deleteUser(@Req() req) {
    return await this.userService.deleteUser(req.user.id);
  }
}
