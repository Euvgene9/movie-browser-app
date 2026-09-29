import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { OmdbController } from './omdb.controller';
import { OmdbRateLimiterService } from './omdb-rate-limiter.service';

@Module({
    controllers: [OmdbController],
    providers: [OmdbService, OmdbRateLimiterService],
    exports: [OmdbService],
})
export class OmdbModule { }