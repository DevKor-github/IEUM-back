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
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FirstLoginDto } from './dtos/first-login.dto';
import { UserService } from './user.service';

@ApiTags('유저 API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //최초 로그인시 유저 정보 받아오기.
  @UseGuards(AuthGuard('access'))
  @Put('/me/info')
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 201, description: '유저 정보 입력 성공' })
  @ApiOperation({
    summary: '최초 유저 정보 기입',
  })
  async fillUserInfo(@Body() firstLoginDto: FirstLoginDto, @Req() req) {
    return await this.userService.fillUserInfo(firstLoginDto, req.user.id);
  }

  @UseGuards(AuthGuard('access'))
  @Delete('/me')
  //스웨거에서 header에 Access Token 담아서 보낸 것을 받기 위함.
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 200, description: '회원 탈퇴 성공' })
  @ApiOperation({
    summary: '회원탈퇴',
  })
  async deleteUser(@Req() req) {
    return await this.userService.deleteUser(req.user.id);
  }
}
