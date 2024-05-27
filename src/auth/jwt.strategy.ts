import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null
          if (req && req.cookies) {
            token = req.cookies['token']
          }
          return token
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne({ where: { id: payload.sub } })

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }

    return {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}
