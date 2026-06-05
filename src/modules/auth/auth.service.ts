import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDTO, SignupDTO } from './dto/auth.dto';
import { IUser } from 'src/common/interfaces';
import { UserRepository } from 'src/common/repository';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}
  async signup(data: SignupDTO): Promise<IUser> {
    const exist = await this.userRepository.findOne({
      filter: { email: data.email },
    });
    if (exist) {
      throw new ConflictException('Email Already Exist ✖️');
    }
    const user = await this.userRepository.createOne({ data });
    return user.toJSON();
  }

  login(data: LoginDTO) {
    return data;
  }
}
