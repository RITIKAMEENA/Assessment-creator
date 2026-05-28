import http from 'http';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket, notifyAssignment } from './sockets/socket.js';
import RedisPackage from 'ioredis';

const RedisClient = RedisPackage as any;

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  const subscriber = new RedisClient({
    host: env.redisHost,
    port: env.redisPort
  });

  await subscriber.subscribe('assignment-events');

  subscriber.on('message', (_channel: string, message: string) => {
    const event = JSON.parse(message);
    notifyAssignment(event.assignmentId, event);
  });

  server.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
// updated