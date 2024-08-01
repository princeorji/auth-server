import {
  Body,
  Controller,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, RegisterDto, resetPwdDto } from './dto/auth.dto';

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

  @Post('forgot-password')
  forgotPwd(@Body('email') email: string) {
    return this.authService.forgotPwd(email);
  }

  @Put('reset-password')
  @UsePipes(new ValidationPipe())
  resetPwd(@Body() dto: resetPwdDto) {
    return this.authService.resetPwd(dto.newPassword, dto.resetToken);
  }
}
