import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';
import { Users } from 'src/users/entities/users.entity';
import { Chats } from 'src/chats/entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { BlockedusersModule } from 'src/blockedusers/blockedusers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Users, Chats]), UserchatsModule, MessagesModule, UsersModule, BlockedusersModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
