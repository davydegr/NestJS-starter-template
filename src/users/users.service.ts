import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { FindOptions } from 'sequelize'
import { CreateUserDto } from 'src/auth/dto/create-user.dto'
import { toUserDto, toUserDtos } from '../auth/mapper'
import { UserDto } from './dto/user.dto'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users: User[] = await this.userModel.findAll()
    return toUserDtos(users)
  }

  async findOne(where: FindOptions<User>): Promise<UserDto> {
    const user: User = await this.userModel.findOne(where)
    return toUserDto(user)
  }

  /**
   * Finds the user for authentication, returning it without transforming it to a DTO that strips the passwordHash.
   * @param where
   * @returns
   */
  async findForAuth(where: FindOptions<User>): Promise<User> {
    return this.userModel.findOne(where)
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    const {
      username,
      email,
      firstName,
      lastName,
      password: plainPassword,
    } = dto

    const passwordHash = await this.hashPassword(plainPassword)

    const newUser = await this.userModel.create({
      username,
      email,
      firstName,
      lastName,
      passwordHash,
    })

    return toUserDto(newUser)
  }

  private async hashPassword(password: string) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  }
}
