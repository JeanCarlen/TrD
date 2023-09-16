import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './users/entities/users.entity';
import { Matches } from './matches/entities/matches.entity';
import { BannedUsers } from './bannedusers/entities/banneduser.entity';
import { BlockedUsers } from './blockedusers/entities/blockeduser.entity';
import { MutedUsers } from './mutedusers/entities/muteduser.entity';
import { Messages } from './messages/entities/message.entity';
import { Achievments } from './achievments/entities/achievment.entity';
import { UserAchievments } from './user_achievments/entities/user_achievment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'database',
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        entities: [
          Users,
          Matches,
          BannedUsers,
          BlockedUsers,
          MutedUsers,
          Messages,
          Achievments,
          UserAchievments,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
