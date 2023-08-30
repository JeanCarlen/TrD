import { Module } from '@nestjs/common';
import { BlockedusersService } from './blockedusers.service';
import { BlockedusersController } from './blockedusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUsers } from './entities/blockeduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUsers])],
  controllers: [BlockedusersController],
  providers: [BlockedusersService],
  exports: [BlockedusersService]
})
export class BlockedusersModule {}
