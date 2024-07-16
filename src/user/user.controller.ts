import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  profile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
