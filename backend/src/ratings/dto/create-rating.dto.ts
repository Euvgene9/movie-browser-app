import { IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateRatingDto {
    @IsString()
    @Matches(/^tt\d{7,9}$/, { message: 'imdbId must look like tt0372784' })
    imdbId!: string;

    @IsInt()
    @Min(1)
    @Max(10)
    score!: number;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    review?: string;
}
