import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [ChatsModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
