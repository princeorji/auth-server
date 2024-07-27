import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LogInDto, PwdDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

      // Create the organization
      await this.prismaService.organisation.create({
        data: {
          name: `${dto.firstName}'s Organisation`,
          description: '',
          author: {
            connect: { id: user.id }, // Connect the user as the author
          },
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
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async login(dto: LogInDto) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { email: dto.email },
      });

      const isCorrectPassword = await argon.verify(user.password, dto.password);

      if (!isCorrectPassword)
        throw new ForbiddenException('Incorrect Credentials');

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
      if (error.code == 'P2025')
        throw new ForbiddenException('Incorrect Credentials');
      throw error;
    }
  }

  async changePwd(dto: PwdDto, userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      await argon.verify(user.password, dto.oldPassword);

      const newPassword = await argon.hash(dto.newPassword);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });

      return {
        status: 'success',
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error.code == 'P2025')
        throw new ForbiddenException('Incorrect Credentials');
      throw error;
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
