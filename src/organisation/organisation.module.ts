import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [OrganisationController],
  providers: [OrganisationService, PrismaService],
})
export class OrganisationModule {}
