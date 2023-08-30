import { Module } from '@nestjs/common';
import { AchievmentsService } from './achievments.service';
import { AchievmentsController } from './achievments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievments } from './entities/achievment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievments])],
  controllers: [AchievmentsController],
  providers: [AchievmentsService],
  exports: [AchievmentsService]
})
export class AchievmentsModule {}
