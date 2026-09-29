import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post()
  create(@Body() dto: CreateBookmarkDto, @CurrentUser() user: { userId: string }) {
    return this.bookmarksService.create(user.userId, dto.imdbId);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.bookmarksService.findAll(user.userId);
  }

  @Delete(':imbdId')
  remove(@CurrentUser() user: { userId: string }, @Param('imdbId') imdbId: string) {
    return this.bookmarksService.remove(user.userId, imdbId);
  }
}
