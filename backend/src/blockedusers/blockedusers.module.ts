import { Module } from '@nestjs/common';
import { BlockedusersService } from './blockedusers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUsers } from './entities/blockeduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUsers])],
  providers: [BlockedusersService],
  exports: [BlockedusersService],
})
export class BlockedusersModule {}
