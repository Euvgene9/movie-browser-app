import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) { }

  @Get()
  get(@CurrentUser() user: { userId: string }, @Query('limit') limit?: string) {
    return this.recommendationsService.getForUser(user.userId, limit ? parseInt(limit, 10) : undefined);
  }
}
