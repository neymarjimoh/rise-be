import { NextFunction, Request, Response } from "express";
import {
  findAllUsers,
  findUserByEmail,
  saveUser,
} from "../services/user.services";
import { errorResponse, successRes } from "../helpers/response";
import { AuthModule } from "../helpers/auth";
import { IRequestUser } from "../types";
import {
  fetchTopUsers,
  getPostsByUserId,
  savePost,
} from "../services/post.services";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password, name, lastname } = req.body;
    email = email.toLowerCase();
    const userExist = await findUserByEmail(email);
    if (userExist) {
      return errorResponse(res, "Email already exists", 409);
    }
    const hashedPassword = AuthModule.hashPassWord(password);
    const user = await saveUser({ ...req.body, password: hashedPassword });
    const token = AuthModule.generateToken(
      { userId: user.id, email: user.email },
      "1d"
    );
    const { password: _password, ...otherUserInfo } = user;
    return successRes(res, { user: otherUserInfo, token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const userExist = await findUserByEmail(email);
    if (!userExist) {
      return errorResponse(res, "Invalid email or password", 400);
    }
    const isPasswordValid = AuthModule.compareHash(
      password,
      userExist.password
    );

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 400);
    }
    const token = AuthModule.generateToken(
      { userId: userExist.id, email: userExist.email },
      "1h"
    );
    const { password: _password, ...otherUserInfo } = userExist;
    return successRes(res, { user: otherUserInfo, token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();
    return successRes(res, users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const createUserPost = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const userId = +req.params.id;
    if (userId !== user.id) {
      return errorResponse(res, "Forbidden: Unauthorized Access", 403);
    }
    const post = await savePost({ ...req.body, user_id: userId });
    return successRes(res, post);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserPosts = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const userId = +req.params.id;
    if (userId !== user.id) {
      return errorResponse(res, "Forbidden: Unauthorized Access", 403);
    }
    const posts = await getPostsByUserId(userId);
    return successRes(res, posts);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getTopThreeUsers = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const topUsers = await fetchTopUsers();
    return successRes(res, topUsers);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
