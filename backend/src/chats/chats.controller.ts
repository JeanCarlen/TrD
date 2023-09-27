import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth.guard';
import { Chats } from './entities/chat.entity';
import { Messages } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';

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
  addUserToChat(@Param('id') id: string, @Body() body) {
	return this.chatsService.addUserToChat(+id, body);
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
