import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { UserChats } from 'src/userchats/entities/userchat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, UserChats]), MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}
