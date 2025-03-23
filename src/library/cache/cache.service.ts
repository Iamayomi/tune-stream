import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CACHE_INSTANCE } from '../config';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_INSTANCE) private cache: Cacheable) {}

  private stringifyIfNeeded<T = any>(value: T): string | T {
    if (value && (typeof value === 'object' || Array.isArray(value))) {
      return JSON.stringify(value);
    }
    return value;
  }

  private parseIfNeeded<T = any>(value: any): T {
    try {
      return JSON.parse(value);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return value as unknown as T;
    }
  }

  public async get<T = any>(key: string): Promise<T | undefined> {
    const value = await this.cache.get<T>(key);
    return value ? this.parseIfNeeded<T>(value) : undefined;
  }

  public async set<T>(
    key: string,
    value: T,
    ttl?: number | string,
  ): Promise<boolean> {
    const stringifiedValue = this.stringifyIfNeeded(value);
    return await this.cache.set(key, stringifiedValue, ttl);
  }

  public async delete(key: string): Promise<boolean> {
    return await this.cache.delete(key);
  }

  public async clear(): Promise<void> {
    return await this.cache.clear();
  }
}
