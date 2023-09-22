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
import { AuthGuard } from 'src/auth.guard';
import { BlockedusersService } from './blockedusers.service';
import { CreateBlockeduserDto } from './dto/create-blockeduser.dto';
import { UpdateBlockeduserDto } from './dto/update-blockeduser.dto';

@Controller('blockedusers')
export class BlockedusersController {
  constructor(private readonly blockedusersService: BlockedusersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBlockeduserDto: CreateBlockeduserDto) {
    return this.blockedusersService.create(createBlockeduserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.blockedusersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.blockedusersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlockeduserDto: UpdateBlockeduserDto,
  ) {
    return this.blockedusersService.update(+id, updateBlockeduserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.blockedusersService.remove(+id);
  }
}
