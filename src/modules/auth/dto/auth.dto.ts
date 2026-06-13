
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common/decorator';

export class ResendConfirmEmailDto  {
  @IsEmail({} , { message: 'Please Enter your email' })
  email!: string;
}

export class ConfirmEmailDTO extends ResendConfirmEmailDto{
  @Matches(/^d{6}$/)
  otp! : string;

}
export class LoginDTO {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  FCM?: string;
}

export class SignupDTO extends LoginDTO {
  @Length(2, 20, { message: 'Invalid range is 2 - 20' })
  username!: string;
  @ValidateIf((object: SignupDTO) => {
    return Boolean(object.password);
  })
  @IsMatch<string>(['password'], { message: 'Fail' })
  confirmPassword!: string;
  @Allow()
  phone!:string;
}


export class SignupWithGoogleDTO  {
  @IsString()
  @IsNotEmpty()
  idToken !:string;

}