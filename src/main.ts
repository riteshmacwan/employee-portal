import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //apply global middleware for dto validations
  app.useGlobalPipes(new ValidationPipe());

  await app
    .listen(3001)
    .then(() => console.log('Server is started on 3001'))
    .catch((err) => {
      console.log("Server hasn't started. Some error occurred");
      console.log('Error: ', err);
    });
}
bootstrap();
