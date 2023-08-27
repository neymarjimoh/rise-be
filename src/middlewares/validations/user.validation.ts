import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { CreatePostPayload, ISignup, LoginPayload } from "../../types";
import { errorResponse } from "../../helpers/response";

class Validator {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<ISignup>({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || "Invalid input";
      return errorResponse(res, errorMessage, 422);
    }
    return next();
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<LoginPayload>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || "Invalid input";
      return errorResponse(res, errorMessage, 422);
    }
    return next();
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<CreatePostPayload>({
      title: Joi.string().required(),
      content: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || "Invalid input";
      return errorResponse(res, errorMessage, 422);
    }
    return next();
  }
}

export default Validator;
