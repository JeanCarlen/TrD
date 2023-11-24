import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { ChatsModule } from 'src/chats/chats.module';
import { UserchatsModule } from 'src/userchats/userchats.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatadminsModule } from 'src/chatadmins/chatadmins.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ChatsModule, UserchatsModule, MessagesModule, ChatadminsModule, UsersModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
