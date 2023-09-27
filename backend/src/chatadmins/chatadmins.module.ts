import { Module } from '@nestjs/common';
import { ChatadminsService } from './chatadmins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatAdmins } from './entities/chatadmin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatAdmins])],
  providers: [ChatadminsService],
  exports: [ChatadminsService]
})
export class ChatadminsModule {}
