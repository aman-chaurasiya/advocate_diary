import { Router } from "express";
import { createNewCase } from "../controllers/case.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewere.js";

const router = Router();

router.route("/AddNewCase").post(verifyJWT, createNewCase);

export default router;
