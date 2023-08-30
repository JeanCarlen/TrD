import { Module } from '@nestjs/common';
import { BannedusersService } from './bannedusers.service';
import { BannedusersController } from './bannedusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedUsers } from './entities/banneduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannedUsers])],
  controllers: [BannedusersController],
  providers: [BannedusersService],
  exports: [BannedusersService]
})
export class BannedusersModule {}
