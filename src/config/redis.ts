import { createClient, RedisClientType } from "redis";
import { ENVS } from ".";

class RedisService {
  private client: RedisClientType;
  private url = ENVS.redis.url || `redis://${ENVS.redis.host}:${ENVS.redis.port}`;

  constructor() {
    this.client = createClient({
      url: this.url,
    });

    (async () => {
      await this.client.connect();
    })();

    this.client.on("connect", () =>
      console.log("Connected to our redis instance!")
    );
    this.client.on("error", (err) =>
      console.log("Redis Client Error due to: ", err)
    );
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async closeClient(): Promise<any> {
    return await this.client.quit();
  }
}

export default new RedisService();
