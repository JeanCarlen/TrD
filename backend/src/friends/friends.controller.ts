import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthGuard, CurrentOrAdminGuard } from 'src/auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.friendsService.findAll();
  }

  @Get('active/list/:id')
  @UseGuards(AuthGuard)
  friendsList(@Param('id') id: number) {
    return this.friendsService.findFriendsList(id);
  }

  @Get('pending/list/:id')
  @UseGuards(AuthGuard)
  pendingList(@Param('id') id: number) {
    return this.friendsService.findPendingFriends(id);
  }

  @Get('requests/list/:id')
  @UseGuards(AuthGuard)
  requestsList(@Param('id') id: number) {
    return this.friendsService.findPendingRequests(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CurrentOrAdminGuard)
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
