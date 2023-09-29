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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FriendsResponse } from './dto/friends.response';

@ApiTags('Friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create a friend (request).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'Friend (request) created.'})
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all friends (requests).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all friends (requests).', type: [FriendsResponse]})
  findAll() {
    return this.friendsService.findAll();
  }

  @Get('active/list/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all friends of a user.', type: [FriendsResponse]})
  friendsList(@Param('id') id: number) {
    return this.friendsService.findFriendsList(id);
  }

  @Get('pending/list/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all pending friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all pending friends of a user.', type: [FriendsResponse]})
  pendingList(@Param('id') id: number) {
    return this.friendsService.findPendingFriends(id);
  }

  @Get('requests/list/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all friend requests of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all friend requests of a user.', type: [FriendsResponse]})
  requestsList(@Param('id') id: number) {
    return this.friendsService.findPendingRequests(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update a friend (request).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Friend (request) updated.'})
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CurrentOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a friend (request).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Friend (request) deleted.'})
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
