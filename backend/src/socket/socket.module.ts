import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { ChatsModule } from 'src/chats/chats.module';
import { UserchatsModule } from 'src/userchats/userchats.module';

@Module({
  imports: [ChatsModule, UserchatsModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
