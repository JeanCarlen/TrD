import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { UserChats } from 'src/userchats/entities/userchat.entity';
import { ChatAdmins } from 'src/chatadmins/entities/chatadmin.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';
import { Users } from 'src/users/entities/users.entity';
import { MutedUsers } from 'src/mutedusers/entities/muteduser.entity';
import { BannedUsers } from 'src/bannedusers/entities/banneduser.entity';
import { BlockedusersModule } from 'src/blockedusers/blockedusers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, UserChats, ChatAdmins, Users, MutedUsers, BannedUsers]), MessagesModule, UserchatsModule, BlockedusersModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}
