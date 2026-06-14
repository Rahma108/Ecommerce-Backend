import { Controller, Get, Req,UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationGuard, AuthorizationGuard } from 'src/common/guard';
import type { IAuthReq } from 'src/common/interfaces';
import { Auth, Role } from 'src/common/decorator';
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
  ) {
    // const user = this.userService.profile();
    return { message: 'Done', data: { user } };
  }
}
