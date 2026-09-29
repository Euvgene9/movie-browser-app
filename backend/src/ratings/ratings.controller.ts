import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(user.userId, createRatingDto.imdbId, createRatingDto.score, createRatingDto.review);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.ratingsService.findAll(user.userId);
  }

  @Delete(':imdbId')
  remove(@CurrentUser() user: { userId: string }, @Param('imdbId') imdbId: string) {
    return this.ratingsService.remove(user.userId, imdbId);
  }
}
