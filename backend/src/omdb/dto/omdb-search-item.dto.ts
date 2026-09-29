import { ApiProperty } from '@nestjs/swagger';

export class OmdbSearchItemDto {
    @ApiProperty({ example: 'Batman Begins' })
    Title!: string;

    @ApiProperty({ example: '2005' })
    Year!: string;

    @ApiProperty({ example: 'tt0372784' })
    imdbID!: string;

    @ApiProperty({ enum: ['movie', 'series', 'episode'], example: 'movie' })
    Type!: string;

    @ApiProperty({
        example: 'https://m.media-amazon.com/images/M/MV5B....jpg',
        description: 'Poster URL, or the literal string "N/A" if none exists.',
    })
    Poster!: string;
}

