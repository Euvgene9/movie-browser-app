import { ApiProperty } from '@nestjs/swagger';


export class BookmarkResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    id!: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    userId!: string;

    @ApiProperty({ example: 'tt0372784' })
    imdbId!: string;

    @ApiProperty({ enum: ['movie', 'series'], example: 'movie' })
    mediaType!: 'movie' | 'series';

    @ApiProperty({ example: '2026-09-30T10:15:00.000Z' })
    createdAt!: Date;
}