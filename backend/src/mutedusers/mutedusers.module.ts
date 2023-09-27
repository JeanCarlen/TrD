import { Module } from '@nestjs/common';
import { MutedusersService } from './mutedusers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutedUsers } from './entities/muteduser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MutedUsers])],
  providers: [MutedusersService],
  exports: [MutedusersService],
})
export class MutedusersModule {}
