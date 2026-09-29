import { ApiProperty } from '@nestjs/swagger';

export class OmdbTitleDetailsDto {
    @ApiProperty({ example: 'Batman Begins' })
    Title!: string;

    @ApiProperty({ example: '2005' })
    Year!: string;

    @ApiProperty({ example: 'PG-13' })
    Rated!: string;

    @ApiProperty({ example: '15 Jun 2005' })
    Released!: string;

    @ApiProperty({ example: '140 min' })
    Runtime!: string;

    @ApiProperty({ example: 'Action, Crime, Drama' })
    Genre!: string;

    @ApiProperty({ example: 'Christopher Nolan' })
    Director!: string;

    @ApiProperty({ example: 'Bob Kane, David S. Goyer, Christopher Nolan' })
    Writer!: string;

    @ApiProperty({ example: 'Christian Bale, Michael Caine, Ken Watanabe' })
    Actors!: string;

    @ApiProperty({ example: 'When his parents are killed...' })
    Plot!: string;

    @ApiProperty({ example: 'https://m.media-amazon.com/images/M/MV5B....jpg' })
    Poster!: string;

    @ApiProperty({ example: '8.2' })
    imdbRating!: string;

    @ApiProperty({ example: 'tt0372784' })
    imdbID!: string;

    @ApiProperty({ enum: ['movie', 'series', 'episode'], example: 'movie' })
    Type!: string;

    @ApiProperty({ enum: ['True', 'False'], example: 'True' })
    Response!: string;
}