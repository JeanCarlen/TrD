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
import { BannedusersService } from './bannedusers.service';
import { CreateBanneduserDto } from './dto/create-banneduser.dto';
import { UpdateBanneduserDto } from './dto/update-banneduser.dto';

@Controller('bannedusers')
export class BannedusersController {
  constructor(private readonly bannedusersService: BannedusersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBanneduserDto: CreateBanneduserDto) {
    return this.bannedusersService.create(createBanneduserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.bannedusersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.bannedusersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBanneduserDto: UpdateBanneduserDto,
  ) {
    return this.bannedusersService.update(+id, updateBanneduserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.bannedusersService.remove(+id);
  }
}
