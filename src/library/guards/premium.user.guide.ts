import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PremiumGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // If the user is not premium, reject access
    if (!user.isPremium) {
      throw new ForbiddenException('Upgrade to premium to access this feature');
    }
    return true; // Allow access if user is premium
  }
}
