import { Request, Response } from "express";
import devaApiService from "../services/deva/deva-api.service";
import gameTransactionsService from "../services/game-transaction.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const getAgentBalance = catchAsync(async (_: Request, res: Response) => {
  const agentBalance = await devaApiService.getAgentBalance();
  return sendResponse(res, { agentBalance });
});

const getGameProviders = catchAsync(async (_: Request, res: Response) => {
  const gameProviders = await devaApiService.getGameProviders();
  return sendResponse(res, { gameProviders });
});

const getGamesByProvider = catchAsync(async (req: Request, res: Response) => {
  const gamesProvider = await devaApiService.getGamesByProvider(
    req.query.providerCode as string
  );
  return sendResponse(res, { gamesProvider });
});

const launchGame = catchAsync(async (req: Request, res: Response) => {
  const gameUrl = await devaApiService.launchGame(req.body);
  return sendResponse(res, { gameUrl });
});

const getUserBalance = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  return sendResponse(res, { balance: user?.balance });
});

const addGameTransaction = catchAsync(async (req: Request, res: Response) => {
  const data = await gameTransactionsService.create(req.body, req.user);
  return sendResponse(res, data.result, data.status);
});

const getGameTransaction = catchAsync(async (req: Request, res: Response) => {
  const data = await devaApiService.getTransaction(req.params.uuid);
  return sendResponse(res, { transaction: data });
});

const getGameTransactions = catchAsync(async (req: Request, res: Response) => {
  const data = await devaApiService.getTransactions(req.query.timepoint as any);
  return sendResponse(res, { ...data });
});

const getGameTransactionsByPeriod = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query as any;
    const data = await devaApiService.getGameTransactionsByPeriod({
      startTimepoint: query.startTimepoint,
      endTimepoint: query.endTimepoint,
    });
    return sendResponse(res, { ...data });
  }
);

const openGameHistory = catchAsync(async (req: Request, res: Response) => {
  const data = await devaApiService.openGameHistory(req.body);
  return sendResponse(res, { history: data });
});

const getGameRoundDetailsById = catchAsync(
  async (req: Request, res: Response) => {
    const data = await devaApiService.getGameRoundDetailsById(req.query as any);
    return sendResponse(res, { roundDetails: data });
  }
);

const getGameRoundDetails = catchAsync(async (req: Request, res: Response) => {
  const data = await devaApiService.getGameRoundDetails(req.query as any);
  return sendResponse(res, { roundDetails: data });
});

const devaController = {
  getAgentBalance,
  getGameProviders,
  getGamesByProvider,
  launchGame,
  getUserBalance,
  addGameTransaction,
  getGameTransaction,
  getGameTransactions,
  getGameTransactionsByPeriod,
  openGameHistory,
  getGameRoundDetailsById,
  getGameRoundDetails,
};

export { devaController };
