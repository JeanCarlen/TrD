import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity'; // Adjust the import path based on your project structure

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async create(userData: Partial<Users>): Promise<Users> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async findByUsername(username: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
