import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OmdbRateLimiterService {
    private queue: Array<() => void> = [];
    private tokens: number;
    private readonly maxTokens: number;

    constructor(private readonly config: ConfigService) {
        this.maxTokens = this.config.get<number>('omdb.maxRequestsPerSecond') ?? 2;
        this.tokens = this.maxTokens;
        setInterval(() => this.refill(), 1000);
    }

    private refill() {
        this.tokens = this.maxTokens;
        this.drain();
    }

    private drain() {
        while (this.tokens > 0 && this.queue.length > 0) {
            this.tokens--;
            const next = this.queue.shift();
            next?.();
        }
    }

    schedule<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push(() => {
                fn().then(resolve).catch(reject);
            });
            this.drain();
        });
    }
}