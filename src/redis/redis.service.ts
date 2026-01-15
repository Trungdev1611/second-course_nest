import { OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export class RedisService implements OnModuleInit {
  private client: RedisClientType | null = null;
  private enabled = false;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const isProduction = process.env.NODE_ENV === 'production'
    // 🔹 Không có env → disable Redis
    if (!redisUrl && isProduction) {
      console.log('⚠️ Redis disabled (REDIS_URL not set)');
      return;
    }

    this.client = createClient({ url: redisUrl });

    try {
      await this.client.connect();
      this.enabled = true;
      console.log('✅ Redis connected');
    } catch (err) {
      console.error('❌ Redis connect failed, running without Redis');
      this.client = null;
      this.enabled = false;
    }
  }

  /** ========= SAFE METHODS ========= */

  async set(key: string, value: string, ttlSeconds?: number) {
    if (!this.enabled || !this.client) return;

    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    if (!this.enabled || !this.client) return null;
    return this.client.get(key);
  }

  async del(key: string) {
    if (!this.enabled || !this.client) return 0;
    return this.client.del(key);
  }

  async incre(key: string) {
    if (!this.enabled || !this.client) return 0;
    return this.client.incr(key);
  }

  async expire(key: string, timeInSecond: number) {
    if (!this.enabled || !this.client) return 0;
    return this.client.expire(key, timeInSecond);
  }

  async getAllKeys(pattern: string) {
    if (!this.enabled || !this.client) return [];
    return this.client.keys(pattern);
  }

  /** ========= HELPER ========= */
  isEnabled() {
    return this.enabled;
  }
}
