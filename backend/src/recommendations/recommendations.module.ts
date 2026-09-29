import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { OmdbModule } from 'src/omdb/omdb.module';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { RatingsModule } from 'src/ratings/ratings.module';
import { SearchHistoryModule } from 'src/search-history/search-history.module';
import { GenrePreferencesModule } from 'src/genre-preferences/genre-preferences.module';

@Module({
  imports: [OmdbModule, BookmarksModule, RatingsModule, SearchHistoryModule, GenrePreferencesModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule { }
