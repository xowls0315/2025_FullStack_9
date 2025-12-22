import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader)
      throw new UnauthorizedException('토큰이 없습니다.');

    // Bearer asdjihdasjkdasnjadklsnjasdk
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      // 디코딩된 정보를 request.user에 저장
      request.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
