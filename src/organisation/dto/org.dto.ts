import { IsNotEmpty, IsString } from 'class-validator';

export class OrganisationDto {
  @IsString()
  @IsNotEmpty({ message: 'name must not be null' })
  name: string;

  @IsString()
  description?: string | null;
}
