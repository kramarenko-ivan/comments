import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  findAll() {
    return this.usersRepo.find();
  }

  findOne(user_id: number) {
    return this.usersRepo.findOne({ where: { user_id } });
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

  async update(user_id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }


  async delete(user_id: number) {
    const res = await this.usersRepo.delete(user_id);
    if (res.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
