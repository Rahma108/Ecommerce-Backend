import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';
import { IsMatch } from 'src/common/decorator/mtach.decorator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

export class LoginBodyDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'Please Enter your email' })
  email!: string;
  @IsStrongPassword()
  @IsNotEmpty()
  password!: string;
}
export class SignupBodyDTO extends LoginBodyDTO {
  @Length(2, 20, { message: 'Invalid range is 2 - 20' })
  username!: string;
  // @Validate(MatchBetweenFields, {
  //   message: 'Password Mismatch with confirmPassword',
  // })
  @IsMatch<string>(['password'], { message: 'Fail' })
  confirmPassword!: string;
}
