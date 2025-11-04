import { BlogService } from './../blogs/blog.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class CronJobsService {
  private readonly logger = new Logger(CronJobsService.name);

  constructor(
    // private readonly redisService: RedisService,
    private readonly blogRepoService: BlogService,
  ) {}


@Cron('*/2 * * * *')
  async clearCache() {
    this.logger.log('🚀 [JOB] Flush views from Redis to DB');
    await this.blogRepoService.flushViewsToDb(); 
    this.logger.log('🚀 [JOB] Flush views done');

  }

//   // ================== JOB 3: (Ví dụ) Gửi email báo cáo ===================
//   @Cron('0 8 * * 1') // 08:00 thứ 2 hàng tuần
//   async sendWeeklyReport() {
//     this.logger.log('📩 [JOB] Sending weekly report email...');
//     // logic gửi email tại đây
//   }
}
