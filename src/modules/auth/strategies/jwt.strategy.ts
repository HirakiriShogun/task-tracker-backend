import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../types/authenticated-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secretOrKey = process.env.JWT_SECRET;

    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  validate(payload: {
    sub?: string;
    email?: string;
    role?: UserRole;
  }): AuthenticatedUser {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
