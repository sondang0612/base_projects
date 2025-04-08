import express from "express";
import { ERole } from "../constants/role.enum";
import { authController } from "../controllers/auth.controller";
import { protect } from "../middlewares/protect";
import { restrictTo } from "../middlewares/restrict-to";
import { userController } from "../controllers/user.controller";
import { validateDto } from "../middlewares/validate-dto";
import { LoginDto } from "../dtos/auth/login.dto";
import { SignUpDto } from "../dtos/auth/sign-up.dto";

const router = express.Router();
router.post("/login", validateDto(LoginDto), authController.login);
router.post("/signup", validateDto(SignUpDto), authController.signup);
router.post("/logout", protect, authController.logout);

router.get(
  "/info",
  protect,
  restrictTo(ERole.USER, ERole.ADMIN),
  authController.info
);
router.get("/", protect, restrictTo(ERole.ADMIN), userController.getAll);

export default router;
