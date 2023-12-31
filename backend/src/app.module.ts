import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database.module';
import { BannedusersModule } from './bannedusers/bannedusers.module';
import { BlockedusersModule } from './blockedusers/blockedusers.module';
import { MutedusersModule } from './mutedusers/mutedusers.module';
import { MessagesModule } from './messages/messages.module';
import { AchievmentsModule } from './achievments/achievments.module';
import { UserAchievmentsModule } from './user_achievments/user_achievments.module';
import { FriendsModule } from './friends/friends.module';
import { SocketModule } from './socket/socket.module';
import { ChatsModule } from './chats/chats.module';
import { UserChats } from './userchats/entities/userchat.entity';
import { ChatadminsModule } from './chatadmins/chatadmins.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    MatchesModule,
    BannedusersModule,
    BlockedusersModule,
    MutedusersModule,
    MessagesModule,
    AchievmentsModule,
    UserAchievmentsModule,
    FriendsModule,
	SocketModule,
	ChatsModule,
	UserChats,
	ChatadminsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
