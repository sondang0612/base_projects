export type UpdateUserBalanceAndCreateTransactionParamters = {
  PlayerCode: string;
  Uuid: string;
  ProviderCode: string;
  GameCode: string;
  GameName: string;
  GameNameEn: string;
  GameCategory: string;
  RoundId: string;
  Type: string;
  Amount: number;
  ReferenceUuid: string;
  RoundStarted: number;
  RoundFinished: number;
  Details: string;
  CreatedBy: string;
};
