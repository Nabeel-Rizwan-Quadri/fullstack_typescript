import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import ms, { type StringValue } from 'ms';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import type { User } from '../users/user.entity';

export type PublicUser = {
  id: string;
  username: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  toPublicUser(user: User): PublicUser {
    return { id: user.id, username: user.username, email: user.email };
  }

  signAccessToken(userId: string): string {
    const expiresInRaw =
      (this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as StringValue;

    const expiresInMs = ms(expiresInRaw);
    const expiresInSeconds =
      typeof expiresInMs === 'number' ? Math.max(1, Math.floor(expiresInMs / 1000)) : 86400;

    return this.jwtService.sign({ sub: userId }, { expiresIn: expiresInSeconds });
  }

  private getCookieName(): string {
    return this.configService.get<string>('COOKIE_NAME') ?? 'access_token';
  }

  private getCookieOptions() {
    const nodeEnv = this.configService.get<string>('NODE_ENV') ?? 'development';
    const isProd = nodeEnv === 'production';

    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  private getCookieMaxAgeMs(): number | undefined {
    const expiresIn =
      (this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as StringValue;
    const parsed = ms(expiresIn);
    return typeof parsed === 'number' ? parsed : undefined;
  }

  setAuthCookie(res: Response, token: string) {
    res.cookie(this.getCookieName(), token, {
      ...this.getCookieOptions(),
      maxAge: this.getCookieMaxAgeMs(),
    });
  }

  clearAuthCookie(res: Response) {
    res.clearCookie(this.getCookieName(), this.getCookieOptions());
  }

  async signup(input: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    const passwordHash = await this.hashPassword(input.password);

    const user = await this.usersService.create({
      username: input.username,
      email: input.email,
      passwordHash,
    });

    const token = this.signAccessToken(user.id);
    return { user: this.toPublicUser(user), token };
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await this.verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signAccessToken(user.id);
    return { user: this.toPublicUser(user), token };
  }
}
