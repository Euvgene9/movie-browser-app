import { Controller, Get, Query } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OmdbSearchResponseDto } from './dto/omdb-search-response.dto';
import { OmdbTitleDetailsDto } from './dto/omdb-title-details.dto';

@ApiTags('media')
@Controller('media')
export class OmdbController {
    constructor(private readonly omdb: OmdbService) { }

    @Get('search')
    @ApiOperation({ summary: 'Search OMDb by title text (cached, rate-limited)' })
    @ApiQuery({ name: 'q', example: 'batman', description: 'Search text' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiResponse({ status: 200, description: 'Matching titles', type: OmdbSearchResponseDto })
    @ApiResponse({ status: 502, description: 'OMDb returned an error (e.g. no matches found)' })
    search(@Query('q') query: string, @Query('page') page?: string) {
        return this.omdb.search(query, page ? parseInt(page, 10) : 1);
    }

    @Get('details')
    @ApiOperation({ summary: 'Get full details for a title by IMDb ID (cached, rate-limited)' })
    @ApiQuery({ name: 'imdbId', example: 'tt0372784' })
    @ApiResponse({ status: 200, description: 'Title details', type: OmdbTitleDetailsDto })
    @ApiResponse({ status: 502, description: 'OMDb returned an error (e.g. invalid ID)' })
    getDetails(@Query('imdbId') imdbId: string) {
        return this.omdb.getByImdbId(imdbId);
    }
}