import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { OmdbController } from 'src/omdb/omdb.controller';
import { OmdbModule } from 'src/omdb/omdb.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenrePreferencesModule } from 'src/genre-preferences/genre-preferences.module';

@Module({
  imports: [OmdbModule, PrismaModule, GenrePreferencesModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule { }
