import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingResponseDto } from './dto/rating-response.dto';


@ApiTags('ratings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @Post()
  @ApiOperation({ summary: 'Rate a title 1-10, with an optional review (upsert)' })
  @ApiResponse({ status: 201, description: 'Rating created or updated', type: RatingResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input, or title is not a movie/series' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser() user: { userId: string }, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(user.userId, createRatingDto.imdbId, createRatingDto.score, createRatingDto.review);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's ratings, newest first" })
  @ApiResponse({ status: 200, description: 'Ratings list', type: [RatingResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.ratingsService.findAll(user.userId);
  }

  @Delete(':imdbId')
  @ApiOperation({ summary: 'Remove a rating' })
  @ApiResponse({ status: 200, description: 'Rating removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(@CurrentUser() user: { userId: string }, @Param('imdbId') imdbId: string) {
    return this.ratingsService.remove(user.userId, imdbId);
  }
}
