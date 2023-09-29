import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UserchatsModule, FriendsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
