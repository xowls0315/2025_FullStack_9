import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TimeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const now = new Date();

    const hour = now.getHours(); // 0~23
    const minute = now.getMinutes(); // 0~59

    /**
     * 허용 시간
     * 13:05 <= 현재시간 <= 13:15
     */
    const isAllowed = hour === 13 && minute >= 5 && minute <= 15;

    if (!isAllowed) {
      throw new ForbiddenException(
        '이 API는 오후 1시 5분부터 1시 15분까지만 접근 가능합니다.',
      );
    }

    return true;
  }
}
