import { ApiProperty } from "@nestjs/swagger";
import { OmdbSearchItemDto } from "./omdb-search-item.dto";

export class OmdbSearchResponseDto {
    @ApiProperty({ type: [OmdbSearchItemDto] })
    Search!: OmdbSearchItemDto[];

    @ApiProperty({ example: '25' })
    totalResults!: string;

    @ApiProperty({ enum: ['True', 'False'], example: 'True' })
    Response!: string;
}