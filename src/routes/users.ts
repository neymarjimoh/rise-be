import { Router } from "express";
import Validator from "../middlewares/validations/user.validation";
import {
  createUserPost,
  getTopThreeUsers,
  getUsers,
  login,
  signUp,
} from "../controllers/user.controller";
import { verificationMiddleware } from "../middlewares/auth";

const router = Router();

router
  .route("/")
  .post(Validator.signUp, signUp)
  .get([verificationMiddleware.validateToken], getUsers);

router.route("/login").post([Validator.login], login);

router
  .route("/top-users")
  .get([verificationMiddleware.validateToken], getTopThreeUsers);

router
  .route("/:id/posts")
  .post(
    [verificationMiddleware.validateToken, Validator.createPost],
    createUserPost
  )
  .get([verificationMiddleware.validateToken], getUsers);

export default router;
