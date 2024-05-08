import { Injectable, UnauthorizedException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { LoginDto } from './dto/login.dto'
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async logIn(dto: LoginDto): Promise<any> {
    const { username, password } = dto

    const user = await this.usersService.findOne({ where: { username } })

    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException()
    }

    return true
  }
}
