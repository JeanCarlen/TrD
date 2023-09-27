import { Module } from '@nestjs/common';
import { UserchatsService } from './userchats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChats } from './entities/userchat.entity';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserChats])],
  providers: [UserchatsService],
  exports: [UserchatsService]
})
export class UserchatsModule {}
