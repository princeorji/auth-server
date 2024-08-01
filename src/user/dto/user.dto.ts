import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PwdDto {
  @IsString()
  @IsNotEmpty({ message: 'Password must not be null' })
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Password must not be null' })
  @MinLength(6)
  newPassword: string;
}
