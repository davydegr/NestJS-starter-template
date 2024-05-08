import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors()

  // Enable a validation pipe with debug messages only on development
  const isDev = process.env.NODE_ENV === 'development'
  const validationPipe = new ValidationPipe({
    enableDebugMessages: isDev,
    disableErrorMessages: !isDev,
  })
  app.useGlobalPipes(validationPipe)

  // Start the application
  await app.listen(3001)
}
bootstrap()
