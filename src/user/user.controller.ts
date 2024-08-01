import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ValidationPipe } from 'src/pipes/validate.pipe';
import { PwdDto } from './dto/user.dto';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  profile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  @UsePipes(new ValidationPipe())
  changePwd(@Body() dto: PwdDto, @Param('id') id: string) {
    return this.userService.changePwd(dto, id);
  }
}
