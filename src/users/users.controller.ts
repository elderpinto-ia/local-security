import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
// @UseGuards(AuthGuard('jwt')) // Placeholder for future auth guard
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user (Admin)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully by admin.' /* type: User - if you have a User entity DTO */ })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error, email already exists).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users.' /* type: [User] */ })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User details.' /* type: User */ })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully.' /* type: User */ })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request (e.g., validation error).' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID (Admin)' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
