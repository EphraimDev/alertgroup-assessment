import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  readonly password: string;
}

export const loginBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .required()
    .messages({ 'any.required': 'Password is required' }),
});
