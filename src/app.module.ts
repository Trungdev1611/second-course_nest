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
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceConfig
    }), 
    ConfigModule.forRoot({
      isGlobal: true, // 👈 Giúp ConfigModule dùng được ở mọi nơi
      envFilePath: '.env', // (tuỳ chọn) chỉ định file env
      cache: true, // (tuỳ chọn) cache để load nhanh hơn
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
    FriendshipModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
