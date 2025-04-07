import express from "express";
import { ERole } from "../constants/role.enum";
import { authController } from "../controllers/auth.controller";
import { protect } from "../middlewares/protect";
import { restrictTo } from "../middlewares/restrict-to";
import { userController } from "../controllers/user.controller";

const router = express.Router();
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);

router.get(
  "/info",
  protect,
  restrictTo(ERole.USER, ERole.ADMIN),
  authController.info
);
router.get("/", protect, restrictTo(ERole.ADMIN), userController.getAll);

export default router;
