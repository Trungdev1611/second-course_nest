import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptor/transform-response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // 1️⃣ Global Interceptor → wrap tất cả response thành 'status: success'
    app.useGlobalInterceptors(new TransformResponseInterceptor());

    // Global Exception Filter wrap error
    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    //config swagger
    const config = new DocumentBuilder()
    .setTitle('Modern Blog Platform API')
    .setDescription('API documentation for Blog Platform (NestJS + Next.js)')
    .setVersion('1.0')
    .addBearerAuth() // bật JWT auth (Authorization: Bearer token)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'My API Docs',
    customCss: `
      .topbar-wrapper::after {
        content: ' | Total Endpoints: ${Object.keys(document.paths).length}';
        font-weight: bold;
        margin-left: 10px;
        color: #fff;
      }
    `
  }); // URL: http://localhost:3000/api/docs



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
