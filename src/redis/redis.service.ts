import { OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

export class RedisService implements OnModuleInit {
  private client: RedisClientType;

   async onModuleInit() {
    this.client = createClient({ url: 'redis://localhost:6379' });
    await this.client.connect();
    console.log('✅ Redis connected');
   }

    async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async incre(key: string) {
    return await this.client.incr(key)
  }

  async expire(key: string, timeInSecond: number) {
    return await this.client.expire(key, timeInSecond)
  }

  async getAllKeys(pattern: string) {
    return await this.client.keys(pattern)
  }

}