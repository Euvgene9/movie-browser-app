import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({ example: 'jan.kowalski@example.com' })
    email!: string;

    @MinLength(8)
    @ApiProperty({ example: 'strongPaswwd4#4', description: 'Password with minimum 8 characters' })
    password!: string;
}
