import { LaunchGameDto } from "../../dtos/deva/launch-game.dto";
import { AgentBalance, GameInfo, GameProvider } from "../../types/deva";
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
}

const devaApiService = new DevaApiService();

export default devaApiService;
