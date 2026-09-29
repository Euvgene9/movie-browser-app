import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OmdbService } from 'src/omdb/omdb.service';
import { GenrePreferencesService } from 'src/genre-preferences/genre-preferences.service';

@Injectable()
export class RatingsService {
  constructor(
    private readonly databaseService: PrismaService,
    private readonly omdb: OmdbService,
    private readonly genrePrefs: GenrePreferencesService
  ) { }

  async create(userId: string, imdbId: string, score: number, review?: string) {
    const details = await this.omdb.getByImdbId(imdbId);

    if (details.Type !== 'movie' && details.Type !== 'series') {
      throw new BadRequestException('Only movies and series can be rated');
    }

    const rating = await this.databaseService.rating.upsert({
      where: { userId_imdbId: { userId, imdbId } },
      update: { score, review },
      create: { userId, imdbId, mediaType: details.Type, score, review },
    });

    await this.genrePrefs.bump(userId, details.Genre, score / 10);

    return rating;
  }

  async findAll(userId: string) {
    return this.databaseService.rating.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, imdbId: string) {
    const result = await this.databaseService.rating.deleteMany({
      where: { userId, imdbId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Rating not found');
    }
    return { removed: true };
  }
}
