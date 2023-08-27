import { Router } from "express";

import { verificationMiddleware } from "../middlewares/auth";
import Validator from "../middlewares/validations/post.validation";
import { createComment } from "../controllers/post.controller";

const router = Router();


router
  .route("/:postId/comments")
  .post([verificationMiddleware.validateToken, Validator.createComment], createComment)


export default router;
