import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
e
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
