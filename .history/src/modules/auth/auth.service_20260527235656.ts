import { Injectable } from '@nestjs/common';
import { LoginSchema, SignupDTO } from './dto/auth.dto';

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
