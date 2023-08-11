import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Add this line
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Make the UserService available for injection in other modules
})
export class UserModule {}
