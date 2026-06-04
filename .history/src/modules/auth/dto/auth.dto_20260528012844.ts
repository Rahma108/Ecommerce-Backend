import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  Validate,
} from 'class-validator';
export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match_Between_Fields', async: false })
export class MatchBetweenFields implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return tr
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text ($value) is too short or too long!';
  }
}
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
  @Validate()
  confirmPassword!: string;
}
