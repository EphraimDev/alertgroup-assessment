import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    required: true,
  })
  readonly firstName: string;

  @ApiProperty({
    required: true,
  })
  readonly lastName: string;

  @ApiProperty({
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  readonly password: string;

  @ApiProperty({
    required: true,
  })
  readonly confirmPassword: string;
}

const isStrongPassword = (password: string) => {
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
  );
  return strongRegex.test(password);
};

const validatePassword = (str: string, helpers: any) => {
  if (!isStrongPassword(str)) return helpers.error('any.invalid');
  return str;
};

export const signUpBodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'string.email': 'Please enter a valid email' }),
  password: Joi.string().required().custom(validatePassword).messages({
    'any.invalid':
      'Your password must contain at least eight characters, one uppercase letter, one lowercase letter, one digit and one special character.',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Confirm password must be the same as password.' }),
});
