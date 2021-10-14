import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDomain {
  @IsString()
  @IsNotEmpty()
  domainName: string;

  @IsEmail()
  email: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
}
