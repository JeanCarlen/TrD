import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database.module';
import { BannedusersModule } from './bannedusers/bannedusers.module';

@Module({
  imports: [
	DatabaseModule,
    LoginModule,
    UsersModule,
    AuthModule,
    MatchesModule,
    BannedusersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
