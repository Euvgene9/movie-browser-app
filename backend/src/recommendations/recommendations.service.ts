import { Injectable } from '@nestjs/common';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { GenrePreferencesService } from 'src/genre-preferences/genre-preferences.service';
import { OmdbService } from 'src/omdb/omdb.service';
import { RatingsService } from 'src/ratings/ratings.service';
import { SearchHistoryService } from 'src/search-history/search-history.service';

const COLD_START_IMDB_IDS = [
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0468569', // The Dark Knight
    'tt0110912', // Pulp Fiction
    'tt0133093', // The Matrix
];

interface ScoredCandidate {
    imdbId: string;
    score: number;
    payload: any;
}

@Injectable()
export class RecommendationsService {
    constructor(
        private readonly omdb: OmdbService,
        private readonly bookmarks: BookmarksService,
        private readonly ratings: RatingsService,
        private readonly searchHistory: SearchHistoryService,
        private readonly genrePrefs: GenrePreferencesService,
    ) { }

    async getForUser(userId: string, limit = 15) {
        const [bookmarks, ratings, recentQueries, topGenres] = await Promise.all([
            this.bookmarks.findAll(userId),
            this.ratings.findAll(userId),
            this.searchHistory.recentQueries(userId, 10),
            this.genrePrefs.topGenres(userId, 5),
        ]);

        const excludeIds = new Set([
            ...bookmarks.map((b) => b.imdbId),
            ...ratings.map((r) => r.imdbId),
        ]);


        const highRated = ratings.filter((r) => r.score >= 7);
        const seedTitles = await this.resolveTitles(highRated.map((r) => r.imdbId));
        const seedQueries = [...new Set([...seedTitles, ...recentQueries])].slice(0, 8);

        if (seedQueries.length === 0 && topGenres.length === 0) {
            return this.coldStart(excludeIds, limit);
        }

        const genreWeights = new Map(topGenres.map((g) => [g.genre, g.weight]));
        const candidates = new Map<string, ScoredCandidate>();

        await Promise.all(
            seedQueries.map(async (q) => {
                const results = await this.omdb.search(q);
                const items = (results.Search ?? []).filter(
                    (r: any) => r.Type === 'movie' || r.Type === 'series',
                );
                for (const item of items.slice(0, 5)) {
                    if (excludeIds.has(item.imdbID) || candidates.has(item.imdbID)) continue;
                    candidates.set(item.imdbID, { imdbId: item.imdbID, score: 0, payload: item });
                }
            }),
        );


        const scored = await Promise.all(
            [...candidates.values()].map(async (c) => {
                const details = await this.omdb.getByImdbId(c.imdbId);
                const genres: string[] = (details.Genre ?? '')
                    .split(',')
                    .map((g: string) => g.trim());
                const score = genres.reduce((sum, g) => sum + (genreWeights.get(g) ?? 0), 0);
                return { ...c, score, payload: details };
            }),
        );

        const ranked = scored.sort((a, b) => b.score - a.score).slice(0, limit);

        if (ranked.length < limit) {
            const fallback = await this.coldStart(excludeIds, limit - ranked.length);
            return [...ranked.map((r) => r.payload), ...fallback];
        }

        return ranked.map((r) => r.payload);
    }

    private async resolveTitles(imdbIds: string[]): Promise<string[]> {
        const details = await Promise.all(imdbIds.map((id) => this.omdb.getByImdbId(id)));
        return details.map((d) => d.Title).filter(Boolean);
    }

    private async coldStart(excludeIds: Set<string>, limit: number) {
        const pool = COLD_START_IMDB_IDS.filter((id) => !excludeIds.has(id)).slice(0, limit);
        return Promise.all(pool.map((id) => this.omdb.getByImdbId(id)));
    }
}
