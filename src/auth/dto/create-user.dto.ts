import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username!: string

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsString({ message: 'Password must be a string' })
  password!: string

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName: string

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName: string
}
