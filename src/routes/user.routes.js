import { Router } from "express";

import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

// router.route("/testing").post(upload.single("avatar"), testing);

export default router;
