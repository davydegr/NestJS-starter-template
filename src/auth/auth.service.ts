import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { Response } from 'express'
import { FindOptions } from 'sequelize'
import { UsersService } from 'src/users/users.service'
import { COOKIE_VALIDITY } from '../constants'
import { User } from '../users/models/user.model'
import { LoginDto } from './dto/login.dto'
import { toUserDto } from './mapper'
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(dto: LoginDto, response: Response): Promise<void> {
    const { password } = dto
    const whereOptions = this.buildWhereOptions(dto)
    const user = await this.usersService.findForAuth(whereOptions)

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

    const userDto = toUserDto(user)

    response.send({
      user: userDto,
      success: true,
    })
  }

  logOut(response: Response): void {
    response.clearCookie('token')
    response.send({ success: true })
  }

  buildWhereOptions(dto: LoginDto): FindOptions<User> {
    const { username, email } = dto

    const whereOptions: any = {}

    if (username) {
      whereOptions.username = username
    }

    if (email) {
      whereOptions.email = email
    }

    return { where: whereOptions }
  }
}
