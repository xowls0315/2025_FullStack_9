import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader)
      throw new UnauthorizedException('토큰이 없습니다.');
    const [_, token] = authorizationHeader.split(' ');
    if (!token) throw new UnauthorizedException('토큰이 유효하지 않습니다.');

    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
