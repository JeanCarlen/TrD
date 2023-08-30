import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MutedusersService } from './mutedusers.service';
import { CreateMuteduserDto } from './dto/create-muteduser.dto';
import { UpdateMuteduserDto } from './dto/update-muteduser.dto';

@Controller('mutedusers')
export class MutedusersController {
  constructor(private readonly mutedusersService: MutedusersService) {}

  @Post()
  create(@Body() createMuteduserDto: CreateMuteduserDto) {
    return this.mutedusersService.create(createMuteduserDto);
  }

  @Get()
  findAll() {
    return this.mutedusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mutedusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMuteduserDto: UpdateMuteduserDto) {
    return this.mutedusersService.update(+id, updateMuteduserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mutedusersService.remove(+id);
  }
}
