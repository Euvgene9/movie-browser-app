import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly jwt: JwtService,
    ) { }

    async signup(email: string, password: string) {
        const existing = await this.users.findByEmail(email);
        if (existing) throw new ConflictException('Email already exists');

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.users.create(email, passwordHash);
        return this.issueToken(user.id, user.email);
    }

    async login(email: string, password: string) {
        const user = await this.users.findByEmail(email);
        if (!user) throw new UnauthorizedException('Wrong email or password');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Wrong email or password');

        return this.issueToken(user.id, user.email);
    }

    private issueToken(userId: string, email: string) {
        return { accessToken: this.jwt.sign({ sub: userId, email }) };
    }
}
