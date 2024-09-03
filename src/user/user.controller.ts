import { Controller, Body, Req, Put, Delete, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirstLoginReqDto, FirstLoginResDto } from './dtos/first-login.dto';
import { UserService } from './user.service';
import { NickNameDuplicateCheckResDto } from './dtos/nickname-dupliate-check-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { ProfileResDto } from './dtos/profile-res.dto';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { UserDocs } from './user.docs';

@ApplyDocs(UserDocs)
@ApiTags('유저 API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/nickname')
  async checkDuplicateNickName(
    @Query('nickname') nickname: string,
  ): Promise<NickNameDuplicateCheckResDto> {
    return this.userService.checkDuplicateNickName(nickname);
  }

  //사용자 프로필 정보 불러오기.
  @Get('/me/profile')
  async getUserProfile(@Req() req): Promise<ProfileResDto> {
    return await this.userService.getUserProfile(req.user.id);
  }

  //최초 로그인시 유저 정보 받아오기.

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

  @Delete('/me')
  async deleteUser(@Req() req) {
    return await this.userService.deleteUser(req.user.id);
  }
}
