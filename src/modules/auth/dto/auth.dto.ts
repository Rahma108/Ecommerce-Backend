
import {
  Allow,
  IsEmail,
  IsNotEmpty,
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
export class LoginDTO extends ResendConfirmEmailDto{

  @IsStrongPassword({minNumbers:3 , minUppercase:1 , minLowercase:1 , minSymbols: 1})
  @IsNotEmpty()
  password!: string;
  FCM?:string;
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
