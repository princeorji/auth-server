import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const password = await argon.hash(dto.password);
      const user = await this.prismaService.user.create({
        data: {
          ...dto,
          password,
        },
      });

      const token = await this.signToken(user.id, user.email);

      return {
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken: token.access_token,
          user: {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Registration unsuccessful',
          statusCode: 400,
        },
        400,
      );
    }
  }

  async login(dto: LogInDto) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { email: dto.email },
      });

      await argon.verify(user.password, dto.password);

      const token = await this.signToken(user.id, user.email);

      return {
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: token.access_token,
          user: {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: 401,
        },
        401,
      );
    }
  }

  private async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
