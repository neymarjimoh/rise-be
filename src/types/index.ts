import { Router, Request } from "express";
import jwt from "jsonwebtoken";

export interface Route {
  resourceName: string;
  route: Router;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ISignup extends LoginPayload {
  email: string;
  lastname: string;
  name: string;
}

export interface Default {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUser extends ISignup, Default {}

export interface IJwtCred {
  id: number;
  email: string;
  name: string;
}

export interface IJwtToken extends jwt.JwtPayload {
  exp?: number;
  iat?: number;
}

export interface IRequestUser extends Request {
  user?: IUser;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  user_id: number;
}

export interface IPost extends CreatePostPayload, Default {}

export interface CreateCommentPayload {
  content: string;
}

export interface IComment extends CreateCommentPayload, Default {
  post_id: number;
  user_id: number;
}
