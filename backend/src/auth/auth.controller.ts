import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
