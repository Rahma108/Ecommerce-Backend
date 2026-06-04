import { Injectable } from '@nestjs/common';
import { V SignupDTO } from './dto/auth.dto';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data: SignupDTO) {
    return data;
  }

  login(data: LoginSchema) {
    return data;
  }
}
