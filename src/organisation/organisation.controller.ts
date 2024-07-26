import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { OrganisationDto } from './dto/org.dto';

@Controller('api/organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Req() req, @Body() dto: OrganisationDto) {
    const authorId = req.user.userId;
    return this.organisationService.create(authorId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.organisationService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orgId')
  findOne(@Req() req, @Param('orgId') orgId: string) {
    const userId = req.user.userId;
    return this.organisationService.findOne(userId, orgId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orgId/users')
  async addUser(
    @Req() req,
    @Param('orgId') orgId: string,
    @Body('userId') userId: string,
  ) {
    const authorId = req.user.userId;
    return this.organisationService.addUser(authorId, orgId, userId);
  }
}
