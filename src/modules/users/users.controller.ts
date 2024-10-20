import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { assignRoleBodySchema, AssignRoleDto } from './dto/assign-role.dto';
import { ValidatorPipe } from 'src/common/pipes/validation.pipes';
import { UserService } from './users.service';
import { DeleteUserDto, deleteUserParamSchema } from './dto/delete-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('assign-role')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 422, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({
    type: AssignRoleDto,
    description: 'Assign role data',
  })
  @HttpCode(HttpStatus.OK)
  async assignRole(
    @Body(new ValidatorPipe<AssignRoleDto>(assignRoleBodySchema))
    body: AssignRoleDto,
  ) {
    return await this.userService.assignRole(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async fetchAllUsers() {
    return await this.userService.fetchAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 422, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteUser(
    @Param(new ValidatorPipe<DeleteUserDto>(deleteUserParamSchema))
    param: DeleteUserDto,
  ) {
    return await this.userService.deleteUser(Number(param.id));
  }
}
