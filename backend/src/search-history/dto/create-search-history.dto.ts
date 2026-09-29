import { IsString, MinLength } from "class-validator";

export class CreateSearchHistoryDto {

    @IsString()
    @MinLength(1)
    query!: string;
}
