import { QueryResult } from "pg";
import { IUser } from "../types";
import { pool } from "../config";

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const saveUser = async (userData: IUser): Promise<IUser> => {
  const { email, name, lastname, password } = userData;
  const query = `
  INSERT INTO users (email, name, lastname, password, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`;

  const values = [email, name, lastname, password, new Date(), new Date()];
  const result: QueryResult<IUser> = await pool.query(query, values);
  return result.rows[0];
};

export const findUserById = async (userId: string): Promise<IUser | null> => {
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [userId];
  const result: QueryResult<IUser> = await pool.query(query, values);
  return result.rows[0];
};

export const findAllUsers = async (): Promise<IUser[]> => {
  const query =
    "SELECT id, email, name, lastname, created_at, updated_at FROM users";
  const result = await pool.query(query);
  return result.rows;
};
