import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { CouponTypeEnum } from '../enums';

@ValidatorConstraint({ name: 'CouponDiscount', async: false })
export class CouponDiscount implements ValidatorConstraintInterface {
  validate(value: number , args: ValidationArguments) {
    if (args.object['type'] as CouponTypeEnum == CouponTypeEnum.PERCENTAGE &&  value > 100 ) {
        return false 
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `We cannot accept  ${args?.property} to exceed  100% `;
  }
}

export function IsValidDiscount(
  constraints?: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: CouponDiscount,
    });
  };
}



@ValidatorConstraint({ name: 'DateRange', async: false })
export class DateRange implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments) {
    return new Date(value).getTime() > new Date(args.object[args.constraints[0]]).getTime()
  }

  defaultMessage(args: ValidationArguments) {
    return `We cannot accept  ${args?.property} to be lower than  ${args?.constraints[0]}`;
  }
}

export function IsDateRange(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: DateRange,
    });
  };
}



@ValidatorConstraint({ name: 'DateGreaterThanNow', async: false })
export class DateGreaterThanNow implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments) {
    return new Date(value).getTime() > Date.now()
  }

  defaultMessage(args: ValidationArguments) {
    return `We cannot accept  ${args?.property} to be lower than now `;
  }
}

export function IsDateGreaterThanNow(
  constraints?: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: DateGreaterThanNow,
    });
  };
}

