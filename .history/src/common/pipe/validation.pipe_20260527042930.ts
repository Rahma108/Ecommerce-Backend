import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    const [firstName, lastName] = value.username?.split(' ') || [];
    console.log({ firstName, lastName });
    if (!firstName || !lastName) {
      throw new BadRequestException('Invalid Username');
    }
    value.firs
    return value;
  }
}
