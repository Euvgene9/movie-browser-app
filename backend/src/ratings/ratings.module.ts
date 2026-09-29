import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { OmdbModule } from 'src/omdb/omdb.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenrePreferencesModule } from 'src/genre-preferences/genre-preferences.module';

@Module({
  imports: [OmdbModule, PrismaModule, GenrePreferencesModule],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService]
})
export class RatingsModule { }
