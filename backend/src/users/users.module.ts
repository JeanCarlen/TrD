import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';
import { FriendsModule } from 'src/friends/friends.module';
import { BlockedusersModule } from 'src/blockedusers/blockedusers.module';
import { UserAchievmentsModule } from 'src/user_achievments/user_achievments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UserchatsModule, FriendsModule, BlockedusersModule, UserAchievmentsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
