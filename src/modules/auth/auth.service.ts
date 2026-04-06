import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: {
    email: string;
    fullName: string;
    password: string;
  }) {
    const existingUser = await this.usersService.findByEmailForAuth(data.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      passwordHash,
      role: UserRole.USER,
    });

    return {
      accessToken: await this.signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
      user,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.usersService.findByEmailForAuth(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser = this.usersService.toSafeUser(user);

    return {
      accessToken: await this.signToken({
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
      }),
      user: safeUser,
    };
  }

  me(userId: string) {
    return this.usersService.findById(userId);
  }

  private signToken(data: { id: string; email: string; role: UserRole }) {
    return this.jwtService.signAsync({
      sub: data.id,
      email: data.email,
      role: data.role,
    });
  }
}
