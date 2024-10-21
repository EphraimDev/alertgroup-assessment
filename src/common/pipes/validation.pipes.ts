import { PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import Joi from 'joi';

export class ValidatorPipe<Dto> implements PipeTransform<Dto> {
  constructor(private schema: Joi.ObjectSchema<any>) {}
  public transform(value: Dto): Dto {
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new HttpException(
        { message: errorMessages },
        HttpStatus.UNPROCESSABLE_ENTITY,
        { cause: errorMessages },
      );
    }
    return value;
  }
}
