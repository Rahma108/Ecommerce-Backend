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

  transform(value: unknown, metadata: ArgumentMetadata): T {
    if (metadata.type !== 'body') return value as T;

    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation Error',
        issues: result.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      });
    }

    return result.data; // ✅ أهم سطر
  }
}
