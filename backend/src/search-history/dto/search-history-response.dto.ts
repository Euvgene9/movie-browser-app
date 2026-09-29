import { ApiProperty } from '@nestjs/swagger';

export class SearchHistoryResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    id!: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    userId!: string;

    @ApiProperty({ example: 'batman' })
    query!: string;

    @ApiProperty({ example: '2026-09-30T10:15:00.000Z' })
    createdAt!: Date;
}