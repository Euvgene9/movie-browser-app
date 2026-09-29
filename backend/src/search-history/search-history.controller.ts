import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) { }

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSearchHistoryDto) {
    return this.searchHistoryService.create(user.userId, dto.query);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.searchHistoryService.findAll(user.userId);
  }

}
