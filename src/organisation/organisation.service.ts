import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrganisationDto } from './dto/org.dto';

@Injectable()
export class OrganisationService {
  constructor(private prismaService: PrismaService) {}

  async create(authorId: string, dto: OrganisationDto) {
    try {
      const orgData = await this.prismaService.organisation.create({
        data: {
          authorId,
          ...dto,
        },
      });

      await this.prismaService.userOrganisation.create({
        data: {
          userId: authorId,
          orgId: orgData.id,
        },
      });

      return {
        status: 'success',
        message: 'Organisation created successfully',
        data: {
          orgId: orgData.id,
          name: orgData.name,
          description: orgData.description,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'Bad request',
          message: 'Client error',
          statusCode: 400,
        },
        400,
      );
    }
  }

  async findAll(userId: string) {
    const orgData = await this.prismaService.organisation.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return {
      status: 'success',
      message: 'Organisation record',
      data: {
        organisations: orgData,
      },
    };
  }

  async findOne(userId: string, orgId: string) {
    await this.prismaService.userOrganisation.findUnique({
      where: {
        userId_orgId: { userId, orgId },
      },
    });

    const orgData = await this.prismaService.organisation.findUnique({
      where: { id: orgId },
    });

    return {
      status: 'success',
      message: 'Organisation record',
      data: {
        orgId: orgData.id,
        name: orgData.name,
        description: orgData.description,
      },
    };
  }
}
