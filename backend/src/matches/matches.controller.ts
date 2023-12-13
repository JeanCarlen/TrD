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
import { AuthGuard, CurrentGuard } from 'src/auth.guard';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MatchesResponse } from './dto/matches.response';

@Controller('matches')
@ApiTags('Matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new match.' })
  @ApiResponse({ status: 201, description: 'The match has been successfully created.', type: MatchesResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  create(@Body() createMatchDto: CreateMatchDto): Promise<MatchesResponse> {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all matches.', description: 'Get all matches where the current user is involved.' })
  @ApiResponse({ status: 200, description: 'Return all matches.', type: [MatchesResponse] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  findAll(@Req() req: any) {
    return this.matchesService.findAll(req.user.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a match.', description: 'Get a match where the current user is involved.' })
  @ApiResponse({ status: 200, description: 'Return the match.', type: MatchesResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @ApiNotFoundResponse({ description: 'Match not found.'})
  findOne(@Param('id') id: number, @Req() req: any) {
    return this.matchesService.findOne(id, req.user.user);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all matches', description: 'Get all matches that have been played.' })
  @ApiResponse({ status: 200, description: 'Return the match.', type: MatchesResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @ApiNotFoundResponse({ description: 'Match not found.'})
  findAllMatches(@Req() req: any) {
	
	return this.matchesService.findAllMatches();
  }


  @Get('/users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all matches of a user.', description: 'Get all matches where the current user is involved (same as GET /api/matches).' })
  @ApiResponse({ status: 200, description: 'Return all matches.', type: [MatchesResponse] })
  @ApiNotFoundResponse({ description: 'Match not found.'}) 
  findByUserId(@Param('id') id: number, @Req() req: any) {
    return this.matchesService.findByUserId(id, req.user.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a match.', description: 'Update a match where the current user is involved.' })
  @ApiResponse({ status: 200, description: 'Return the updated match.' })
  @ApiUnauthorizedResponse({ description: 'Match already finished.'})
  @ApiNotFoundResponse({ description: 'Match not found.'})
  update(@Param('id') id: number, @Body() updateMatchDto: UpdateMatchDto, @Req() req: any) {
    return this.matchesService.update(+id, updateMatchDto, req.user.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CurrentGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a match.', description: 'Delete a match where the current user is involved.' })
  @ApiResponse({ status: 200, description: 'Return the deleted match.' })
  @ApiNotFoundResponse({ description: 'Match not found.'})
  remove(@Param('id') id: number, @Req() req: any) {
    return this.matchesService.remove(+id, req.user.user);
  }
}
