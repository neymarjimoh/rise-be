import { Pool } from "pg";
import { ENVS } from ".";

export const pool = new Pool({
  user: ENVS.db.user,
  host: ENVS.db.host,
  database: ENVS.db.name,
  password: ENVS.db.password,
  port: +ENVS.db.port,
});
