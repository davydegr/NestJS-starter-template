import { UserDto } from '../users/dto/user.dto'
import { User } from '../users/models/user.model'

export const toUserDto = (user: User): UserDto => {
  const { username, firstName, lastName, email } = user

  const userDto: UserDto = { username, firstName, lastName, email }

  return userDto
}

export const toUserDtos = (users: User[]): UserDto[] => {
  return users.map(toUserDto)
}
