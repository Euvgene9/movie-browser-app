import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OmdbService } from './omdb/omdb.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { OmdbModule } from './omdb/omdb.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { RatingsModule } from './ratings/ratings.module';
import { SearchHistoryModule } from './search-history/search-history.module';
import { GenrePreferencesModule } from './genre-preferences/genre-preferences.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }), CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      ttl: (config.get<number>('cache.ttlSeconds') ?? 3600) * 1000, // ms
      max: 500,
    }),
    inject: [ConfigService],
  }), OmdbModule, PrismaModule, UsersModule, AuthModule, BookmarksModule, RatingsModule, SearchHistoryModule, GenrePreferencesModule, RecommendationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
