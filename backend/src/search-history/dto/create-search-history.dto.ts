import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateSearchHistoryDto {

    @ApiProperty({ example: 'batman' })
    @IsString()
    @MinLength(1)
    query!: string;
}
