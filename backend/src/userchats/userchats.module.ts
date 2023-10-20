import { Module } from '@nestjs/common';
import { UserchatsService } from './userchats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChats } from './entities/userchat.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { Users } from 'src/users/entities/users.entity';
import { Chats } from 'src/chats/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChats, Users, Chats])],
  providers: [UserchatsService],
  exports: [UserchatsService]
})
export class UserchatsModule {}
