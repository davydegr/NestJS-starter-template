import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsNotEmpty()
  @IsString()
  password!: string
}
