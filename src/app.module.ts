import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { User } from './users/models/user.model'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name)

  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate()
      this.logger.log('Database connection has been established successfully.')
    } catch (error) {
      this.logger.fatal('Unable to connect to the database:', error)
    }
  }
}
