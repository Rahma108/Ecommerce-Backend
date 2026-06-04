import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(schema: ZodType) {}
  transform(value: string, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    if (!value.password !== value.confirmPassword) {
      throw new BadRequestException('password mismatch');
    }
    return value;
  }
}
