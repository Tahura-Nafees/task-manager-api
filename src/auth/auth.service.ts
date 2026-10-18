import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create(dto.email, passwordHash);
    return this.signToken(user.id, user.email);
  }

  async login(dto: AuthDto) {
    const user = await this.users.findByEmail(dto.email);
    const valid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');
    return this.signToken(user.id, user.email);
  }

  private async signToken(userId: number, email: string) {
    const accessToken = await this.jwt.signAsync({ sub: userId, email });
    return { accessToken };
  }
}
