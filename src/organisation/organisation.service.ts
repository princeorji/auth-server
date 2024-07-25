import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrganisationDto } from './dto/org.dto';

@Injectable()
export class OrganisationService {
  constructor(private prismaService: PrismaService) {}

  async create(authorId: string, dto: OrganisationDto) {
    try {
      const data = await this.prismaService.organisation.create({
        data: {
          authorId,
          ...dto,
        },
      });

      return {
        status: 'success',
        message: 'Organisation created successfully',
        data: {
          orgId: data.id,
          name: data.name,
          description: data.description,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: string) {
    const data = await this.prismaService.organisation.findMany({
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
        organisations: data,
      },
    };
  }

  async findOne(userId: string, orgId: string) {
    await this.prismaService.userOrganisation.findUnique({
      where: {
        userId_orgId: { userId, orgId },
      },
    });

    const data = await this.prismaService.organisation.findUnique({
      where: { id: orgId },
    });

    return {
      status: 'success',
      message: 'Organisation record',
      data: {
        orgId: data.id,
        name: data.name,
        description: data.description,
      },
    };
  }
}
