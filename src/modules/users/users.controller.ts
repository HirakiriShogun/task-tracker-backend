import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }
}
