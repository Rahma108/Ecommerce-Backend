import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class CustomValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}
  transform(value: any, metadata: ArgumentMetadata): T {
    if (metadata.type !== 'body') return value as T;

    const {success , error} = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    return result.data;
  }
}
