import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }

    if (value.password !== value.confirmPassword) {
      throw new BadRequestException('password mismatch');
    }

    return value;
  }
  }

