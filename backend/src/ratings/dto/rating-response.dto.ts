import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class RatingResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    id!: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    userId!: string;

    @ApiProperty({ example: 'tt0372784' })
    imdbId!: string;

    @ApiProperty({ enum: ['movie', 'series'], example: 'movie' })
    mediaType!: 'movie' | 'series';

    @ApiProperty({ minimum: 1, maximum: 10, example: 8 })
    score!: number;

    @ApiPropertyOptional({ example: 'A solid, gritty reboot of the Batman mythos.' })
    review!: string | null;

    @ApiProperty({ example: '2026-09-30T10:15:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2026-09-30T10:15:00.000Z' })
    updatedAt!: Date;
}