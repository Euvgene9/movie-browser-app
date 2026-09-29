import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchHistoryResponseDto } from './dto/search-history-response.dto';


@ApiTags('search-history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) { }

  @Post()
  @ApiOperation({ summary: 'Log a search query (call after searching, feeds recommendations)' })
  @ApiResponse({ status: 201, description: 'Query logged', type: SearchHistoryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSearchHistoryDto) {
    return this.searchHistoryService.create(user.userId, dto.query);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's recent searches" })
  @ApiResponse({ status: 200, description: 'Search history list', type: [SearchHistoryResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.searchHistoryService.findAll(user.userId);
  }

}
