import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  findOne(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto) {
    const user = this.usersRepo.create(dto);

    try {
      return await this.usersRepo.save(user);
    } catch (error) {
      // Проверяем MySQL код ошибки дубликата
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
      throw error; // пробрасываем остальные ошибки
    }
  }

  async delete(id: number) {
    const res = await this.usersRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
