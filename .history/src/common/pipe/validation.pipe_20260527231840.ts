import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(schema:zod){}
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    if (!value.password !== value.confirmPassword ) {
      throw new BadRequestException('password mismatch');
    }
    return value;
  }
}
