import { BlogModule } from './../blogs/blog.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsService } from './Cronjob.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Khởi chạy cron job
    BlogModule
  ],
  providers: [CronJobsService],
})
export class CronJobsModule {}
