import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, PwdDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() dto: LogInDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  changePwd(@Body() dto: PwdDto, @Param('id') id: string) {
    return this.authService.changePwd(dto, id);
  }

  @Post('forgot-password')
  forgotPwd(@Body('email') email: string) {
    return this.authService.forgotPwd(email);
  }
}
