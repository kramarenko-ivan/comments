import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

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

  async create(data: Partial<Users>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async delete(id: number) {
    const res = await this.usersRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
