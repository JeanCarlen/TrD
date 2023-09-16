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
import { MutedusersService } from './mutedusers.service';
import { CreateMuteduserDto } from './dto/create-muteduser.dto';
import { UpdateMuteduserDto } from './dto/update-muteduser.dto';

@Controller('mutedusers')
export class MutedusersController {
  constructor(private readonly mutedusersService: MutedusersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createMuteduserDto: CreateMuteduserDto) {
    return this.mutedusersService.create(createMuteduserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.mutedusersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.mutedusersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMuteduserDto: UpdateMuteduserDto,
  ) {
    return this.mutedusersService.update(+id, updateMuteduserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.mutedusersService.remove(+id);
  }
}
