import { Injectable, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);