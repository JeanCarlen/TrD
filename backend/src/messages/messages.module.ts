import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { UserchatsModule } from 'src/userchats/userchats.module';

@Module({
  imports: [TypeOrmModule.forFeature([Messages]), UserchatsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
