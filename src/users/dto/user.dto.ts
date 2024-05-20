import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UserDto {
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsEmail()
  email: string
}
