import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matches } from './entities/matches.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Matches])],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService]
})
export class MatchesModule {}
