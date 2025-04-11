import express from "express";
import { ERole } from "../constants/role.enum";
import { devaController } from "../controllers/deva.controller";
import { protect } from "../middlewares/protect";
import { protectDeva } from "../middlewares/protectDeva";
import { restrictTo } from "../middlewares/restrict-to";
import { validateQuery } from "../middlewares/validateParam";
import { validateDto } from "../middlewares/validate-dto";
import { GameTransactionDto } from "../dtos/deva/game-transaction.dto";
import { LaunchGameDto } from "../dtos/deva/launch-game.dto";

const router = express.Router();

// seamless
router.get(
  "/Balance",
  validateQuery(["playerCode", "PlayerNotFound"]),
  protectDeva,
  devaController.getUserBalance
);

router.post(
  "/Transaction",
  validateDto(GameTransactionDto),
  protectDeva,
  devaController.addGameTransaction
);

// base
router.use(protect);

router.get(
  "/AgentBalance",
  restrictTo(ERole.ADMIN),
  devaController.getAgentBalance
);
router.get("/GameProviders", devaController.getGameProviders);
router.get(
  "/Games",
  validateQuery(["providerCode", "ProviderCodeNotFound"]),
  devaController.getGamesByProvider
);
router.post(
  "/LaunchGame",
  validateDto(LaunchGameDto),
  devaController.launchGame
);

export default router;
