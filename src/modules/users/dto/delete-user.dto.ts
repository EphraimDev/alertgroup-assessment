import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({
    required: true,
  })
  readonly id: number;
}

export const deleteUserParamSchema = Joi.object({
  id: Joi.number().required(),
});
