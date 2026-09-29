import { IsString, Matches } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    @Matches(/^tt\d{7,9}$/, { message: 'imdbId must look like tt0372784' })
    imdbId!: string;
}
