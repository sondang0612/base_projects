import { LaunchGameDto } from "../../dtos/deva/launch-game.dto";
import { OpenGameHistoryDto } from "../../dtos/deva/open-game-history.dto";
import {
  AgentBalance,
  DevaGameTransaction,
  GameInfo,
  GameProvider,
} from "../../types/deva";
import { DevaConfigService } from "./deva-config.service";

class DevaApiService extends DevaConfigService {
  async getAgentBalance() {
    const res = await this.get<AgentBalance>("IntegrationApi/AgentBalance");
    return res;
  }

  async getGameProviders() {
    const res = await this.get<GameProvider[]>("IntegrationApi/GameProviders");
    return res;
  }

  async getGamesByProvider(providerCode?: string) {
    const res = await this.get<GameInfo[]>(`IntegrationApi/Games`, {
      providerCode,
    });
    return res;
  }

  async launchGame(args: LaunchGameDto) {
    const res = await this.post<string>(`IntegrationApi/LaunchGame`, args);
    return res;
  }

  async getTransaction(uuid: string) {
    const res = await this.get<DevaGameTransaction[]>(
      `DataFeedAPI/Transaction`,
      { uuid }
    );
    return res;
  }

  async getTransactions(timepoint?: string) {
    const res = await this.get<{
      nextTimepoint?: number;
      transactions: DevaGameTransaction[];
    }>(`DataFeedAPI/Transactions`, { timepoint });
    return res;
  }

  async getGameTransactionsByPeriod(args: {
    startTimepoint: number;
    endTimepoint?: number;
  }) {
    const res = await this.get<{
      nextTimepoint?: number;
      transactions: DevaGameTransaction[];
    }>(`DataFeedAPI/TransactionsByPeriod`, args);
    return res;
  }

  async openGameHistory(args: OpenGameHistoryDto) {
    const res = await this.post<{
      uuid?: string;
      countryCode?: string;
      localeCode?: string;
    }>(`DataFeedAPI/OpenGameHistory`, args);
    return res;
  }

  async getGameRoundDetailsById(args: {
    providerCode: string;
    roundId: string;
  }) {
    const res = await this.get(`DataFeedAPI/GameRoundDetailsById`, args);
    return res;
  }

  async getGameRoundDetails(args: { timepoint?: string }) {
    const res = await this.get(`DataFeedAPI/GameRoundDetails`, args);
    return res;
  }
}

const devaApiService = new DevaApiService();

export default devaApiService;
