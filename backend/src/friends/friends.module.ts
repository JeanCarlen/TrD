import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';
import { Users } from 'src/users/entities/users.entity';
import { BlockedusersService } from 'src/blockedusers/blockedusers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friends, Users]), BlockedusersService],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
