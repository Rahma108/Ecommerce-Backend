import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'CheckGTE', async: false })
export class CheckGTE implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {

    return (value  < args.object[args.constraints[0]])
  }

  defaultMessage(args: ValidationArguments) {
    return `can not accept  ${args.property} to be less than ${args.constraints[0]}`;
  }
}

export function IsGTE(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: constraints,
      validator: CheckGTE,
    });
  };
}
