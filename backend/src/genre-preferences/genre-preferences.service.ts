import { Injectable } from '@nestjs/common';
import { CreateGenrePreferenceDto } from './dto/create-genre-preference.dto';
import { UpdateGenrePreferenceDto } from './dto/update-genre-preference.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenrePreferencesService {
  constructor(private readonly databaseService: PrismaService) { }

  async bump(userId: string, genreString: string | undefined, amount: number) {
    if (!genreString) return;
    const genres = genreString.split(',').map((g) => g.trim()).filter(Boolean);

    await Promise.all(
      genres.map((genre) =>
        this.databaseService.genrePreference.upsert({
          where: { userId_genre: { userId, genre } },
          update: { weight: { increment: amount } },
          create: { userId, genre, weight: amount },
        }),
      ),
    );
  }

  topGenres(userId: string, limit = 5) {
    return this.databaseService.genrePreference.findMany({
      where: { userId },
      orderBy: { weight: 'desc' },
      take: limit,
    });
  }
}
