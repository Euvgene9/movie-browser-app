import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateRatingDto {
    @ApiProperty({ example: 'tt0372784' })
    @IsString()
    @Matches(/^tt\d{7,9}$/, { message: 'imdbId must look like tt0372784' })
    imdbId!: string;

    @ApiProperty({ minimum: 1, maximum: 10, example: 8 })
    @IsInt()
    @Min(1)
    @Max(10)
    score!: number;

    @ApiPropertyOptional({
        example: 'A solid, gritty reboot of the Batman mythos.',
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    review?: string;
}
