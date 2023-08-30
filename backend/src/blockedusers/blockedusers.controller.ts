import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockedusersService } from './blockedusers.service';
import { CreateBlockeduserDto } from './dto/create-blockeduser.dto';
import { UpdateBlockeduserDto } from './dto/update-blockeduser.dto';

@Controller('blockedusers')
export class BlockedusersController {
  constructor(private readonly blockedusersService: BlockedusersService) {}

  @Post()
  create(@Body() createBlockeduserDto: CreateBlockeduserDto) {
    return this.blockedusersService.create(createBlockeduserDto);
  }

  @Get()
  findAll() {
    return this.blockedusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockedusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockeduserDto: UpdateBlockeduserDto) {
    return this.blockedusersService.update(+id, updateBlockeduserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockedusersService.remove(+id);
  }
}
