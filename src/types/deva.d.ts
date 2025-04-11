export interface GameProvider {
  code?: string | undefined;
  name?: string | undefined;
  name_en?: string | undefined;
  category?: string | undefined;
}

export interface AgentBalance {
  balance?: number | undefined;
}

export interface GameInfo {
  code: string | undefined;
  name: string | undefined;
  name_en: string | undefined;
  category: string | undefined;
  iconUrl: string | undefined;
  demoGameAvailable: boolean | undefined;
}

export interface DevaGameTransaction {
  timepoint: number | undefined;
  uuid: string | undefined;
  playerCode: string | undefined;
  providerCode: string | undefined;
  gameCode: string | undefined;
  gameName: string | undefined;
  gameName_en: string | undefined;
  gameCategory: string | undefined;
  roundId: string | undefined;
  type: string | undefined;
  amount: number | undefined;
  referenceUuid: string | undefined;
  referenceAmount: number | undefined;
  roundStarted: boolean | undefined;
  roundFinished: boolean | undefined;
  details: string | undefined;
  newBalance: number | undefined;
  processedDate: string | undefined;
}
