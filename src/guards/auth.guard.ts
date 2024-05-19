import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { COOKIE_VALIDITY, JWT_VALIDITY } from '../constants'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const token = this.extractTokenFromCookies(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      })

      const newToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          username: payload.username,
        },
        { expiresIn: JWT_VALIDITY },
      )

      response.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_VALIDITY, // 3 days
      })

      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.token
  }
}
