import {Controller, Get, Param, Post, Body, Delete, Put, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':user_id')
  getOne(@Param('user_id') user_id: number) {
    return this.usersService.findOne(user_id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Put(':user_id')
  update(@Param('user_id', ParseIntPipe) user_id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user_id, dto);
  }


  @Delete(':user_id')
  delete(@Param('user_id') user_id: number) {
    return this.usersService.delete(user_id);
  }
}
