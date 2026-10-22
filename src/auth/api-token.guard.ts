import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest(); // $request に当たる
    const header: string | undefined = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { apiToken: token },
    });
    if (!user) throw new UnauthorizedException();

    req.user = user; // 15回目の @CurrentUser() はここを読む
    return true;
  }
}
