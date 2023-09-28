import { Module } from '@nestjs/common';
import { UserAchievmentsService } from './user_achievments.service';
import { UserAchievmentsController } from './user_achievments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievments } from './entities/user_achievment.entity';
import { Achievments } from 'src/achievments/entities/achievment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievments, Achievments])],
  controllers: [UserAchievmentsController],
  providers: [UserAchievmentsService],
  exports: [UserAchievmentsService],
})
export class UserAchievmentsModule {}
