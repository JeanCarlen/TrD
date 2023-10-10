import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { UserChats } from 'src/userchats/entities/userchat.entity';
import { ChatAdmins } from 'src/chatadmins/entities/chatadmin.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, UserChats, ChatAdmins]), MessagesModule, UserchatsModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}
