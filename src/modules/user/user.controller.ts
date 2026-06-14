import { Controller, Get, MaxFileSizeValidator, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import type {  IUser } from 'src/common/interfaces';
import { Auth } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';
import type { HUserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFieldValidation, LocalMulter } from 'src/common/utils';

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

  @UseInterceptors(FileInterceptor("attachment" ,LocalMulter({ validation : fileFieldValidation.image , folder :"User" , }) ) )
  @Auth([RoleEnum.USER ])
  @Patch("profile-image")
  profileImage(
    @UploadedFile(new ParseFilePipe({fileIsRequired: true, validators: [new MaxFileSizeValidator({maxSize: 2 * 1024 * 1024 })] })) file :Express.Multer.File ,
    @User() user:HUserDocument):any {
    return file;
  }


  
}
