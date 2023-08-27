import { Request, Response, NextFunction } from "express";
import { AuthModule } from "../helpers/auth";
import { errorResponse } from "../helpers/response";
import { findUserById } from "../services/user.services";
import { IRequestUser } from "../types";

class VerificationMiddleware {
  public validateToken = async (
    req: IRequestUser,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    let token: string;
    if (!authHeader) {
      return errorResponse(res, "Unauthorized. Missing credentials", 401);
    }

    const separateBearer = authHeader.split(" ");
    if (separateBearer.includes("Bearer")) {
      token = separateBearer[1];
    } else {
      token = authHeader;
    }

    try {
      const grantAccess = AuthModule.verifyToken(token);
      const { verified, details, message } = grantAccess;
      if (!verified) {
        return errorResponse(res, "Unauthorized. Invalid token", 401);
      }

      const auth_user = await findUserById(details.userId);
      if (!auth_user) {
        return errorResponse(res, "Invalid token", 403);
      }

      req.user = auth_user;

      return next();
    } catch (err) {
      console.error(err);
      if (err?.name === "TokenExpiredError") {
        return errorResponse(res, "Unauthorized. Token expired", 401);
      }
      if (err?.name === "JsonWebTokenError") {
        return errorResponse(res, "Unauthorized. Invalid token format.", 401);
      }
      return errorResponse(
        res,
        "Something went wrong, please try again later.",
        500
      );
    }
  };
}

export const verificationMiddleware = new VerificationMiddleware();
