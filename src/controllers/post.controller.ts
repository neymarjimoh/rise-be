import { NextFunction, Request, Response } from "express";

import { errorResponse, successRes } from "../helpers/response";
import { IRequestUser } from "../types";
import { getPostById, savePostComment } from "../services/post.services";

export const createComment = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const postId = +req.params.postId;

    const postExists = await getPostById(postId);
    if (!postExists) {
      return errorResponse(res, "Post not found", 404);
    }

    const comment = await savePostComment({
      post_id: postId,
      user_id: user.id,
      content: req.body.content,
    });

    return successRes(res, comment);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
