import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const config = new DocumentBuilder()
    .setTitle('Modern Blog Platform API')
    .setDescription('API documentation for Blog Platform (NestJS + Next.js)')
    .setVersion('1.0')
    .addBearerAuth() // bật JWT auth (Authorization: Bearer token)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // URL: http://localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
