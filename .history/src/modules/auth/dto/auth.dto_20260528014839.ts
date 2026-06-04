import { z } from 'zod';
import { loginSchema, signupSchema } from '../auth.validation';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Length,
  registerDecorator,
  ValidationOptions,
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
  validate(value: string, args: ValidationArguments) {
    console.log({
      value,
      args,
      matchWith: (args.object as any)[args.constraints[0]],
    });
    return (args.object as any)[args.constraints[0]] == value;
  }

  defaultMessage(args: ValidationArguments) {
    console.log({ args });
    return `Fail to match between ${args.property} with ${args.}`;
  }
}

export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MatchBetweenFields,
    });
  };
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
  // @Validate(MatchBetweenFields, {
  //   message: 'Password Mismatch with confirmPassword',
  // })
  @IsMatch(['password'], { message: 'Fail' })
  confirmPassword!: string;
}
