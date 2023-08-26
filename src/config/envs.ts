import { config } from "dotenv";

config();

export default {
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST,
    version: process.env.VERSION,
  },
  db: {
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  }
};
