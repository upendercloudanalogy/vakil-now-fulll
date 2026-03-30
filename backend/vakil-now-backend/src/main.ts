import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';


async function bootstrap() {

  try {
    dotenv.config();
    const isProd = process.env.NODE_ENV === 'production';
    const SERVER_PORT =
      isProd
        ? process.env.PROD_PORT || 5001
        : process.env.DEV_PORT || 3001;

    const FRONTEND_URL = isProd
      ? process.env.PROD_FRONTEND_URL
      : process.env.DEV_FRONTEND_URL;

    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      rawBody: true,
    });
    app.use(cookieParser());

    app.engine('hbs', require('exphbs'));
    app.setViewEngine('hbs');
    app.setGlobalPrefix('api/v2');

    app.enableCors({
      origin: [FRONTEND_URL!, 'http://localhost:3000', "http://yamanote.proxy.rlwy.net:19635"],
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
        'x-demo-number',
      ],
    });

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
    console.log(`🚀 Running in ${isProd ? 'PROD' : 'DEV'} mode`);
    console.log(`🚀 Application is running on: http://localhost:${SERVER_PORT}`);
    console.log(`🚀 Drizzle Studio is up and running on:  https://local.drizzle.studio`);
    
    console.log(
      `📚 Swagger documentation is available at: http://localhost:${SERVER_PORT}/swagger`,
    );
  } catch (error) {
    console.log('ERROR --', error);
  }
}
bootstrap();
