import { Router } from "express";
import { addNewCase } from "../controllers/case.controller.js";
// import { verifyJWT } from "../middlewares/auth.middlewere.js";

const router = Router();

router.route("/AddNewCase").post(addNewCase);

export default router;
