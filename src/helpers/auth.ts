import crypto from "bcryptjs";
import jwt from "jsonwebtoken";
import { IJwtCred, IJwtToken } from "../types";
import { ENVS } from "../config";

class AuthUtils {
  public hashPassWord(password: string): string {
    return crypto.hashSync(password, ENVS.jwt.salt);
  }

  public compareHash(password: string, hash: string): boolean {
    return crypto.compareSync(password, hash);
  }

  public generateToken(
    payload: string | object | Buffer,
    expIn: string
  ): string {
    return jwt.sign(payload, ENVS.jwt.secret, { expiresIn: expIn });
  }

  public verifyToken(token: string): {
    verified: boolean;
    details?: any;
    message?: string;
  } {
    try {
      const tokenVerified = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as IJwtToken;
      delete tokenVerified.exp;
      delete tokenVerified.iat;
      return { verified: true, details: tokenVerified };
    } catch (e) {
      switch (e.name) {
        case "JsonWebTokenError":
          return { verified: false, message: "Invalid Link" };
        case "TokenExpiredError":
          return { verified: false, message: "Link expired" };
        default:
          return { verified: false, message: e.name };
      }
    }
  }

  public generateJWT(details: IJwtCred): string {
    return jwt.sign(details, ENVS.jwt.secret);
  }
}

export const AuthModule = new AuthUtils();
