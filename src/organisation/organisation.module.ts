import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [OrganisationController],
  providers: [OrganisationService, PrismaService, JwtService],
})
export class OrganisationModule {}
