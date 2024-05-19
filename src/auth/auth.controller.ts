import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    return this.authService.logIn(dto, response)
  }

  @Post('logout')
  logout(@Res() response: Response) {
    return this.authService.logOut(response)
  }
}
