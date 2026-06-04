import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

@Inject
export class ValidationPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        return value;
    }

}