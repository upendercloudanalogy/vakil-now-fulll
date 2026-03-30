import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  try {
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
    });
    const SERVER_PORT =
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_PORT || 5001
        : process.env.DEV_PORT || 3000;

    app.use(cookieParser());
    dotenv.config();

    app.engine('hbs', require('exphbs'));
    app.setViewEngine('hbs');
    app.setGlobalPrefix('api/v2');

    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
      optionsSuccessStatus: 200,
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'x-forwarded-for',
        'token',
        'x-api-key',
        'Authorization',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
      ],
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Vakil Now Application API')
      .setDescription('API documentation of Vakil Now Application API')
      .setVersion('2.0.1')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'authorization')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token', // 👈 name used in @ApiBearerAuth()
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(SERVER_PORT);

    console.log(`🚀 Application is running on: http://localhost:${SERVER_PORT}`);
    console.log(
      `📚 Swagger documentation is available at: http://localhost:${SERVER_PORT}/swagger`,
    );
  } catch (error) {
    console.log('ERROR --', error);
  }
}
bootstrap();
