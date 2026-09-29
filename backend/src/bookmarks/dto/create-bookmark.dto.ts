import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class CreateBookmarkDto {
    @ApiProperty({
        example: 'tt0372784',
        description: 'IMDb ID of the title to bookmark',
    })
    @IsString()
    @Matches(/^tt\d{7,9}$/, { message: 'imdbId must look like tt0372784' })
    imdbId!: string;
}
