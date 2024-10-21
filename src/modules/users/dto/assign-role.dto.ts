import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    required: true,
  })
  readonly userId: number;

  @ApiProperty({
    required: true,
  })
  readonly roleId: number;
}

export const assignRoleBodySchema = Joi.object({
  userId: Joi.number()
    .required()
    .messages({ 'any.required': 'UserId is required' }),
  roleId: Joi.number()
    .required()
    .messages({ 'any.required': 'RoleId is required' }),
});
