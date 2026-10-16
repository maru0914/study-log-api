import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 次: Authorization: Bearer <token> を読み、User を探す。無ければ 401
    return true;
  }
}
