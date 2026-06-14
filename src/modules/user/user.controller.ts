import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import type {  IUser } from 'src/common/interfaces';
import { Auth } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';
import type { HUserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Auth([RoleEnum.USER ])
  @Get()

  profile(
    @User() user:HUserDocument
  ):IUser {
    // const user = this.userService.profile();
    return user;
  }
}
