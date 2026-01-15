import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceConfig from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blogs/blog.module';
import { RedisModule } from './redis/redis.module';
import { CronJobsModule } from './cronjob/Cronjob.module';
import { CouldinaryModule } from './cloudinary/cloudinari.module';
import { CommentModule } from './comments/comment.module';
import { BlogTagsModule } from './blog_tags/blog_tags.module';
import { TagModule } from './tags/tag.module';
import { ElasticsearchModule } from './elasticsearch/essearch.module';
import { ChatModule } from './chat/chat.module';
import { FriendshipModule } from './friend_ship/friend_ship.module';
import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // 👈 Giúp ConfigModule dùng được ở mọi nơi
      // Tự động chọn file env dựa trên NODE_ENV
      // Thứ tự ưu tiên: .env.local > .env.{NODE_ENV} > .env
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`, // .env.development.local hoặc .env.production.local
        `.env.${process.env.NODE_ENV || 'development'}`,        // .env.development hoặc .env.production
        '.env.local',                                          // .env.local (cho local development)
        '.env',                                                 // .env (fallback)
      ],
      cache: true, // (tuỳ chọn) cache để load nhanh hơn
    }),
    TypeOrmModule.forRoot({
      ...dataSourceConfig
    }), 
    UserModule,
    AuthModule,
    BlogModule,
    RedisModule,
    CronJobsModule,
    CouldinaryModule,
    CommentModule,
    BlogTagsModule,
    TagModule,
    ElasticsearchModule,
    ChatModule,
    FriendshipModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
