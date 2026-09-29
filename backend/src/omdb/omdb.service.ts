import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { OmdbRateLimiterService } from './omdb-rate-limiter.service';

@Injectable()
export class OmdbService {

    constructor(private config: ConfigService, private readonly rateLimiter: OmdbRateLimiterService, @Inject(CACHE_MANAGER) private readonly cache: Cache,) { }

    private async request(params: Record<string, string>) {

        const cacheKey = `omdb:${JSON.stringify(params)}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const data = await this.rateLimiter.schedule(async () => {
            const url = new URL(this.config.get<string>('omdb.baseUrl')!);
            url.searchParams.set('apikey', this.config.get<string>('omdb.apiKey')!);
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, value);
            });

            const res = await fetch(url);
            const json = await res.json();

            return json;
        });
        await this.cache.set(cacheKey, data);

        return data;
    }

    search(query: string, page = 1) {
        return this.request({ s: query, page: String(page) });
    }

    getByImdbId(imdbId: string) {
        return this.request({ i: imdbId, plot: 'full' });
    }

    getByTitle(title: string, year?: string) {
        const params: Record<string, string> = { t: title, plot: 'full' };
        if (year) params.y = year;
        return this.request(params);
    }

}
