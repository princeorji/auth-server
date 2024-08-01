import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LogInDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
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
        throw new ForbiddenException('An error occurred during login');
      throw error;
    }
  }

  async forgotPwd(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });

      if (!user) throw new NotFoundException('Email not registered');

      const resetToken = uuidv4();

      user.resetPwdToken = resetToken;
      user.resetPwdExp = new Date(Date.now(), 1); // 1 hour from now

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          resetPwdToken: user.resetPwdToken,
          resetPwdExp: user.resetPwdExp,
        },
      });

      // Send the reset email
      await this.mailService.sendPwdResetEmail(user.email, resetToken);

      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async resetPwd(newPassword: string, resetToken: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { resetPwdToken: resetToken, resetPwdExp: { gte: new Date() } },
      });

      if (!user) {
        throw new ForbiddenException('Invalid or expired reset token');
      }

      const password = await argon.hash(newPassword);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: password,
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new ForbiddenException(error);
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
