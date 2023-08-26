import { createClient } from "redis";
import { ENVS } from ".";

const client = createClient({
  url: `redis://${ENVS.redis.host}:${ENVS.redis.port}`,
});

(async () => {
  await client.connect();
})();

client.on("connect", () => console.log("Connected to our redis instance!"));
client.on("error", (err) => console.log("Redis Client Error due to: ", err));

export default client;
