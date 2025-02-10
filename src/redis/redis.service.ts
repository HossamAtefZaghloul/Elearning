import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.connect().catch(console.error);
  }

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.client.set(token, 'blacklisted', { EX: expiresIn });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return (await this.client.exists(token)) === 1;
  }
}
