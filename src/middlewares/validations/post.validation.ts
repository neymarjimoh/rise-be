import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { CreateCommentPayload } from "../../types";
import { errorResponse } from "../../helpers/response";

class Validator {
  static async createComment(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object<CreateCommentPayload>({
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
