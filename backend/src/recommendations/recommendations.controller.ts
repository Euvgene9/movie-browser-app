import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { CurrentUser, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OmdbTitleDetailsDto } from 'src/omdb/dto/omdb-title-details.dto';

@ApiTags('recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get personalized recommendations',
    description:
      'Seeded from the user\'s highly-rated titles and recent searches, scored by genre-preference overlap. Falls back to a small curated list for users with no signal yet.',
  })
  @ApiQuery({ name: 'limit', required: false, example: 15 })
  @ApiResponse({ status: 200, description: 'Recommended titles', type: [OmdbTitleDetailsDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get(@CurrentUser() user: { userId: string }, @Query('limit') limit?: string) {
    return this.recommendationsService.getForUser(user.userId, limit ? parseInt(limit, 10) : undefined);
  }
}
