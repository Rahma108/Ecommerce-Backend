import { Injectable } from '@nestjs/common';
import { IFile, IUser } from 'src/common/interfaces';
import { S3Service } from 'src/common/utils';
import { HUserDocument } from 'src/DB/models';

@Injectable()
export class UserService {
  constructor(private readonly s3Service : S3Service ) {}
  profile() {
    return {
      id: 23,
      username: 'Rahma',
      age: 22,
    };
  }
  async profileImage(file: IFile , user: HUserDocument): Promise<IUser>{
      const oldImage = user.profileImage ;
      user.profileImage = await this.s3Service.uploadAsset({file , path : `Users/${user._id.toString()}`})
      await user.save();
      if(oldImage){
        await this.s3Service.deleteAsset({Key : oldImage })
      }
      return user.toJSON()

  }












}
