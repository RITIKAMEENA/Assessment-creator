import RedisPackage from 'ioredis';
import { env } from './env.js';

const RedisClient = RedisPackage as any;

export const redisConnection = new RedisClient({
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null
});