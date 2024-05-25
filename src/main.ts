import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Extract allowed origins from environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

  // Enable CORS with specific configuration
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })

  // Enable a validation pipe with debug messages only on development
  const isDev = process.env.NODE_ENV === 'development'
  const validationPipe = new ValidationPipe({
    enableDebugMessages: isDev,
    disableErrorMessages: !isDev,
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  })

  app.useGlobalPipes(validationPipe)
  app.use(cookieParser())

  // Start the application
  await app.listen(3001)
}
bootstrap()
