import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PwdDto } from './dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return {
      status: 'success',
      message: 'User record',
      data: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async changePwd(dto: PwdDto, userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');

      const isOldPassword = await argon.verify(user.password, dto.oldPassword);
      if (!isOldPassword) throw new ForbiddenException('Incorrect Credentials');

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
      throw new ForbiddenException(error);
    }
  }
}
