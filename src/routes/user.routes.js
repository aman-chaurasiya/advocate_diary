import { Router } from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";

import { verifyJWT } from "./../middlewares/auth.middlewere.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/testing").post(upload.single("avatar"), testing);

export default router;
