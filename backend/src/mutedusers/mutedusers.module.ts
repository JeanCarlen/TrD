import { Module } from '@nestjs/common';
import { MutedusersService } from './mutedusers.service';
import { MutedusersController } from './mutedusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutedUsers } from './entities/muteduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MutedUsers])],
  controllers: [MutedusersController],
  providers: [MutedusersService],
  exports: [MutedusersService],
})
export class MutedusersModule {}
