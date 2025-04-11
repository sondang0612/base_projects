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
