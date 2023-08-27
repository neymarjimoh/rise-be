import { AuthModule } from "../helpers/auth";
import { IJwtCred } from "../types";
import { RedisService } from "../config";

describe("AuthUtils", () => {
  afterAll(async () => {
    await RedisService.closeClient();
  });
  const password = "securePassword";
  const hash = AuthModule.hashPassWord(password);
  const payload: IJwtCred = { id: 123, email: "test@test.com", name: "test" };
  const expiresIn = "1h";
  const token = AuthModule.generateToken(payload, expiresIn);

  it("should hash and compare passwords correctly", () => {
    const isPasswordMatch = AuthModule.compareHash(password, hash);
    expect(isPasswordMatch).toBeTruthy();
  });

  it("should generate and verify JWT token correctly", () => {
    const verifyResult = AuthModule.verifyToken(token);
    expect(verifyResult.verified).toBeTruthy();
    expect(verifyResult.details).toEqual(payload);
  });

  it("should generate JWT token correctly", () => {
    const jwtToken = AuthModule.generateJWT(payload);
    const verifyResult = AuthModule.verifyToken(jwtToken);
    expect(verifyResult.verified).toBeTruthy();
    expect(verifyResult.details).toEqual(payload);
  });

  it("should handle invalid token verification", () => {
    const invalidToken = "invalidToken";
    const verifyResult = AuthModule.verifyToken(invalidToken);
    expect(verifyResult.verified).toBeFalsy();
    expect(verifyResult.message).toBeDefined();
  });
});
