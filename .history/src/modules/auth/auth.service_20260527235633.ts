import { Injectable } from '@nestjs/common';
import { SignupDTO } from './dto/auth.dto';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data: SignupDTO) {
    return data;
  }

  login(data: LoginDto) {
    return data;
  }
}
