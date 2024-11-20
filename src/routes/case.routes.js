import { Router } from "express";
import { addNewCase } from "../controllers/case.controller.js";
// import { verifyJWT } from "../middlewares/auth.middlewere.js";

const router = Router();

router.route("/addNewCase").post(addNewCase);

export default router;
