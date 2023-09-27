import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth.guard';
import { Chats } from './entities/chat.entity';
import { Messages } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ChatsBodyDto } from './dto/chats-body.dto';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(AuthGuard)
export class ChatsController {
  constructor(
	private readonly messagesService: MessagesService,
	private readonly chatsService: ChatsService) {}

  @Post()
  @ApiOperation({summary: 'Create a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User created.', type: Chats})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  @ApiOperation({summary: 'Get all chats.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all chats.', type: [Chats]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id/users')
  @ApiOperation({summary: 'Get all users in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all users in a chat.', type: [Chats]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findChatUsers(@Param('id') id: string) {
	return this.chatsService.findChatUsers(+id);
  }

  @Get(':id/messages')
  @ApiOperation({summary: 'Get all messages in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all messages in a chat.', type: [Messages]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findChatMessages(@Param('id') id: string) {
	return this.messagesService.findChatMessages(+id);
  }

  @Post(':id/users')
  @ApiOperation({summary: 'Add a user to a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User added to chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  addUserToChat(@Param('id') id: string, @Body() body : ChatsBodyDto) {
	return this.chatsService.addUserToChat(+id, body);
  }

  @Post(':id/users/ban')
  @ApiOperation({summary: 'Ban a user from a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User banned from chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  banUserFromChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.banUserFromChat(+id, body);
  }

  @Post(':id/users/unban')
  @ApiOperation({summary: 'Unban a user from a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User unbanned from chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  unbanUserFromChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.unbanUserFromChat(+id, body);
  }

  @Post(':id/users/leave')
  @ApiOperation({summary: 'Leave a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User left chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  leaveChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.leaveChat(+id, body);
  }

  @Post(':id/users/mute')
  @ApiOperation({summary: 'Mute a user in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User muted in chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  muteUserInChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.muteUserInChat(+id, body);
  }

  @Post(':id/users/unmute')
  @ApiOperation({summary: 'Unmute a user in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User unmuted in chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  unmuteUserInChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.unmuteUserInChat(+id, body);
  }

  @Post(':id/users/admin')
  @ApiOperation({summary: 'Set a user as admin in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User set as admin in chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  setAdminInChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.setAdminInChat(+id, body);
  }

  @Post(':id/users/unadmin')
  @ApiOperation({summary: 'Unset a user as admin in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User unset as admin in chat.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  unsetAdminInChat(@Param('id') id: string, @Body() body: ChatsBodyDto) {
	return this.chatsService.unsetAdminInChat(+id, body);
  }

  @Get(':id/users/banned')
  @ApiOperation({summary: 'Get all banned users in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all banned users in a chat.', type: [Chats]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findChatBannedUsers(@Param('id') id: string) {
	return this.chatsService.findChatBannedUsers(+id);
  }

  @Get(':id/users/muted')
  @ApiOperation({summary: 'Get all muted users in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all muted users in a chat.', type: [Chats]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findChatMutedUsers(@Param('id') id: string) {
	return this.chatsService.findChatMutedUsers(+id);
  }

  @Get(':id/users/admins')
  @ApiOperation({summary: 'Get all admins in a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all admins in a chat.', type: [Chats]})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findChatAdmins(@Param('id') id: string) {
	return this.chatsService.findChatAdmins(+id);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return a chat.', type: Chats})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Chat updated.'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a chat.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Chat deleted..'})
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
