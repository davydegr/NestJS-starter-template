import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  IsEmail,
  Unique,
} from 'sequelize-typescript'

@Table({
  tableName: 'user',
  timestamps: true,
  paranoid: true, // Enables soft deletes, which will use the deletedAt column
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string

  @IsEmail
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string

  @Column(DataType.STRING)
  firstName: string

  @Column(DataType.STRING)
  lastName: string

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @DeletedAt
  deletedAt: Date
}
