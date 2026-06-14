import { Controller, Get, MaxFileSizeValidator, ParseFilePipe, Patch, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import type {  IFile, IUser } from 'src/common/interfaces';
import { Auth } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';
import type { HUserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudMulter, fileFieldValidation, LocalMulter } from 'src/common/utils';

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

  @UseInterceptors(FileInterceptor("attachment" , CloudMulter({ validation : fileFieldValidation.image  })) )
  @Auth([RoleEnum.USER ])
  @Patch("profile-image")
  async profileImage(
    @UploadedFile(new ParseFilePipe({fileIsRequired: true, validators: [new MaxFileSizeValidator({maxSize: 2 * 1024 * 1024 })] })) file :IFile,
    @User() user:HUserDocument):Promise<IUser>{
    return await this.userService.profileImage(file , user )
    }

  @UseInterceptors(FilesInterceptor("attachments" , 3 , LocalMulter({ validation : fileFieldValidation.image , folder :"User"}) ) )
  @Auth([RoleEnum.USER ])
  @Patch("profile-cover-image")
  profileCoverImage(
    @UploadedFiles(new ParseFilePipe({fileIsRequired: true, validators: [new MaxFileSizeValidator({maxSize: 2 * 1024 * 1024 })] })) files :Array<IFile> ,
    @User() user:HUserDocument):any {
    return files;
  }


  @UseInterceptors(FileFieldsInterceptor([{name : "profile" , maxCount: 1 } , {name : "cover" , maxCount: 3 }], LocalMulter({ validation : fileFieldValidation.image , folder :"User"}) ) )
  @Auth([RoleEnum.USER ])
  @Patch("uploads")
  uploads(
    @UploadedFiles(new ParseFilePipe({fileIsRequired: true })) files :{profile : Array<IFile> , cover : Array<IFile>},
    @User() user:HUserDocument):any {
    return files;
  }

}
