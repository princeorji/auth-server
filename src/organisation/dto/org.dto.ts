import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrganisationDto {
  @IsString()
  @IsNotEmpty({ message: 'name must not be null' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
