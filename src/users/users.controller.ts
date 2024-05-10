import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import { AuthGuard } from '../guards/auth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
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
