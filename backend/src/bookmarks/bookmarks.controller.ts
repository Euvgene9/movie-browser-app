import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookmarkResponseDto } from './dto/bookmark-response.dto';


@ApiTags('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post()
  @ApiOperation({ summary: 'Bookmark a title (idempotent - bookmarking twice is a no-op)' })
  @ApiResponse({ status: 201, description: 'Bookmark created (or already existed)', type: BookmarkResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid imdbId, or title is not a movie/series' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateBookmarkDto, @CurrentUser() user: { userId: string }) {
    return this.bookmarksService.create(user.userId, dto.imdbId);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's bookmarks, newest first" })
  @ApiResponse({ status: 200, description: 'Bookmarks list', type: [BookmarkResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.bookmarksService.findAll(user.userId);
  }

  @Delete(':imbdId')
  @ApiOperation({ summary: 'Remove a bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  remove(@CurrentUser() user: { userId: string }, @Param('imdbId') imdbId: string) {
    return this.bookmarksService.remove(user.userId, imdbId);
  }
}
