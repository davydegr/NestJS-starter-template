import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { FindOptions } from 'sequelize'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll() {
    return this.userModel.findAll()
  }

  async findOne(where: FindOptions<User>) {
    return this.userModel.findOne(where)
  }

  async create(dto: CreateUserDto) {
    const {
      username,
      email,
      firstName,
      lastName,
      password: plainPassword,
    } = dto

    const passwordHash = await this.hashPassword(plainPassword)

    return this.userModel.create({
      username,
      email,
      firstName,
      lastName,
      passwordHash,
    })
  }

  private async hashPassword(password: string) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  }
}
