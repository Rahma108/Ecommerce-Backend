import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class ValidationPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        return value;
    }

}