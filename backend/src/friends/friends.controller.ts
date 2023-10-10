import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthGuard, CurrentOrAdminGuard } from 'src/auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
  @ApiConflictResponse({description: 'Friend (request) already exists.'})
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
  findAll(@Req() req: any) {
    return this.friendsService.findAllByUser(req.user.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get a friend (request).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiNotFoundResponse({description: 'Friend (request) not found.'})
  @ApiResponse({status: 200, description: 'Friend (request) found.', type: FriendsResponse})
  friendReq(@Param('id') id: string, @Req() req: any) {
	return this.friendsService.findOne(+id, req.user.user);
  }

  @Post('add/id/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Add a friend by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiConflictResponse({description: 'Friend (request) already exists.'})
  @ApiResponse({status: 201, description: 'Friend (request) created.'})
  addFriend(@Param('id') id: number, @Req() req: any) {
	return this.friendsService.addFriendById(+id, req.user.user);
  }

  @Post('add/username/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Add a friend by username.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiBadRequestResponse({description: 'Username not found.'})
  @ApiConflictResponse({description: 'Friend (request) already exists.'})
  @ApiResponse({status: 201, description: 'Friend (request) created.'})
  addFriendByUsername(@Param('username') username: string, @Req() req: any) {
	return this.friendsService.addFriendByUsername(username, req.user.user);
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

  @Get('active/list/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all friends of a user.', type: [FriendsResponse]})
  @ApiNotFoundResponse({description: 'User not found.'})
  friendsListByUsername(@Param('username') username: string) {
	return this.friendsService.findFriendsListByUsername(username);
  }

  @Get('active/count/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get the number of friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Number of friends of a user.', type: Number})
  friendsCount(@Param('id') id: number) {
	return this.friendsService.findFriendsCount(id);
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

  @Get('pending/count/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get the number of pending friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Number of pending friends of a user.', type: Number})
  pendingCount(@Param('id') id: number) {
	return this.friendsService.findPendingCount(id);
  }

  @Get('pending/list/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all pending friends of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all pending friends of a user.', type: [FriendsResponse]})
  @ApiNotFoundResponse({description: 'User not found.'}) 
  pendingListByUsername(@Param('username') username: string) {
	return this.friendsService.findPendingFriendsByUsername(username);
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

  @Get('requests/list/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all friend requests of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all friend requests of a user.', type: [FriendsResponse]})
  @ApiNotFoundResponse({description: 'User not found.'})
  requestsListByUsername(@Param('username') username: string) {
	return this.friendsService.findPendingRequestsByUsername(username);
  }


  @Get('requests/count/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get the number of friend requests of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Number of friend requests of a user.', type: Number})
  requestsCount(@Param('id') id: number) {
	return this.friendsService.findRequestsCount(id);
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

  @Delete('active/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a friend.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Friend deleted.'})
  removeFriend(@Param('id') id: string, @Req() req: any) {
	return this.friendsService.remove(+id, req.user.user);
  }

  @Delete('cancel/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a friend request.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Friend request deleted.'})
  removeRequest(@Param('id') id: string, @Req() req: any) {
	return this.friendsService.cancel(+id, req.user.user);
  }

  @Delete('reject/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a pending friend.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Pending friend deleted.'})
  removePending(@Param('id') id: string, @Req() req: any) {
	return this.friendsService.reject(+id, req.user.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a friend (request).'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Friend (request) deleted.'})
  remove(@Param('id') id: string, @Req() req: any) {
    return this.friendsService.remove(+id, req.user.user);
  }
}
