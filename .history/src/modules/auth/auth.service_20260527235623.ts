import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor() {}
  signup(data: SignupDtO) {
    return data;
  }

  login(data: LoginDto) {
    return data;
  }
}
