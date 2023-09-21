import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request): boolean | Promise<boolean> {
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: 'RS256',
      });
      if (payload.twofaenabled) throw new UnauthorizedException();
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class CurrentOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request): boolean | Promise<boolean> {
    if (
      request.user.user == request.params.id ||
      request.user.username == 'saeby'
    )
      return true;
    return false;
  }
}


@Injectable()
export class OTPGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
	  const request = context.switchToHttp().getRequest();
	  return this.validateRequest(request);
	}
  
	private validateRequest(request): boolean | Promise<boolean> {
	  const token = this.extractToken(request);
	  if (!token) throw new UnauthorizedException();
	  try {
		const payload = jwt.verify(token, process.env.JWT_SECRET, {
		  algorithm: 'RS256',
		});
		request['user'] = payload;
	  } catch {
		throw new UnauthorizedException();
	  }
	  return true;
	}
  
	private extractToken(request): string | undefined {
	  const [type, token] = request.headers.authorization?.split(' ') ?? [];
	  return type === 'Bearer' ? token : undefined;
	}
  }