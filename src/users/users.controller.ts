import { Body, Controller, Get, Logger, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findALl() {
    this.logger.log('Finding all users')
    return this.usersService.findAll()
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }
}
