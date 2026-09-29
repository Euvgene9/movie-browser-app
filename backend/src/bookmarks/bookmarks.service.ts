import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { OmdbService } from 'src/omdb/omdb.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenrePreferencesService } from 'src/genre-preferences/genre-preferences.service';

@Injectable()
export class BookmarksService {

  constructor(
    private readonly databaseService: PrismaService,
    private readonly omdb: OmdbService,
    private readonly genrePrefs: GenrePreferencesService,
  ) { }

  async create(userId: string, imdbId: string) {
    const details = await this.omdb.getByImdbId(imdbId);

    if (details.Type !== 'movie' && details.Type !== 'series') {
      throw new BadRequestException('Only movies and series can be bookmarked');
    }

    const bookmark = await this.databaseService.bookmark.upsert({
      where: { userId_imdbId: { userId, imdbId } },
      update: {},
      create: { userId, imdbId, mediaType: details.Type },
    });

    await this.genrePrefs.bump(userId, details.Genre, 1);

    return bookmark;
  }

  async findAll(userId: string) {
    return this.databaseService.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, imdbId: string) {
    const result = await this.databaseService.bookmark.deleteMany({
      where: { userId, imdbId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Bookmark not found');
    }
    return { removed: true };
  }
}
