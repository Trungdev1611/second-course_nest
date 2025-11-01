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
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

}