import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { Response } from 'express'
import { UsersService } from 'src/users/users.service'
import { LoginDto } from './dto/login.dto'
import { COOKIE_VALIDITY } from '../constants'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(dto: LoginDto, response: Response): Promise<void> {
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

    // Set the JWT token as an HTTP-only cookie
    response.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_VALIDITY,
    })

    response.send({ success: true })
  }

  logOut(response: Response): void {
    response.clearCookie('token')
    response.send({ success: true })
  }
}
