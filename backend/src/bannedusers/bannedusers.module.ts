import { Module } from '@nestjs/common';
import { BannedusersService } from './bannedusers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedUsers } from './entities/banneduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannedUsers])],
  providers: [BannedusersService],
  exports: [BannedusersService],
})
export class BannedusersModule {}
