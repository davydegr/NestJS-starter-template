import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { LoginDto } from './dto/login.dto'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(dto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = dto

    const user = await this.usersService.findOne({ where: { username } })

    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user.id, username: user.username }
    const accessToken = await this.jwtService.signAsync(payload)

    return { accessToken }
  }
}
