import { Module } from '@nestjs/common';
import { UserAchievmentsService } from './user_achievments.service';
import { UserAchievmentsController } from './user_achievments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievments } from './entities/user_achievment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievments])],
  controllers: [UserAchievmentsController],
  providers: [UserAchievmentsService],
  exports: [UserAchievmentsService],
})
export class UserAchievmentsModule {}
