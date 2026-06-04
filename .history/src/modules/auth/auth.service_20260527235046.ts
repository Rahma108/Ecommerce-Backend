import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data: SignupDto) {
    return data;
  }

   signup(data: SignupDto) {
    return data;
  }
}
