import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannedusersService } from './bannedusers.service';
import { CreateBanneduserDto } from './dto/create-banneduser.dto';
import { UpdateBanneduserDto } from './dto/update-banneduser.dto';

@Controller('bannedusers')
export class BannedusersController {
  constructor(private readonly bannedusersService: BannedusersService) {}

  @Post()
  create(@Body() createBanneduserDto: CreateBanneduserDto) {
    return this.bannedusersService.create(createBanneduserDto);
  }

  @Get()
  findAll() {
    return this.bannedusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannedusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBanneduserDto: UpdateBanneduserDto) {
    return this.bannedusersService.update(+id, updateBanneduserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannedusersService.remove(+id);
  }
}
