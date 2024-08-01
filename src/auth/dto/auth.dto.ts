import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class LogInDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email must not be null' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password must not be null' })
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LogInDto {
  @IsString()
  @IsNotEmpty({ message: 'First name must not be null' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name must not be null' })
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class resetPwdDto {
  @IsString()
  resetToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Password must not be null' })
  @MinLength(6)
  newPassword: string;
}
