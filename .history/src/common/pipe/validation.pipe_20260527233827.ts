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

    const { success, error , data} = this.schema.safeParse(value);

    if (!success) {
       throw new BadRequestException({
        message: 'Validation Error',
        issues: result.error.issues.map((issue: { message: any; path: any; }) => ({
            message: issue.message,
            path: issue.path,
          }),
        ),
      });
    }

    return data;
  }
}
