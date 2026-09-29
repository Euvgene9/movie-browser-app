import { Controller, Get, Query } from '@nestjs/common';
import { OmdbService } from './omdb.service';

@Controller('media')
export class OmdbController {
    constructor(private readonly omdb: OmdbService) { }

    @Get('search')
    search(@Query('q') query: string, @Query('page') page?: string) {
        return this.omdb.search(query, page ? parseInt(page, 10) : 1);
    }

    @Get('details')
    getDetails(@Query('imdbId') imdbId: string) {
        return this.omdb.getByImdbId(imdbId);
    }
}