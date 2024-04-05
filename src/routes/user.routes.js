import { Router } from "express";

import {
  UpdateUserAvatar,
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  testing,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";

import { verifyJWT } from "./../middlewares/auth.middlewere.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), UpdateUserAvatar);

router.route("/testing").patch(verifyJWT, upload.single("avatar"), testing);

export default router;
