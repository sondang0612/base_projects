import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { EGameTransactionType } from "../../constants/game-transaction-type.enum";

export class GameTransactionDto {
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  playerCode: string;

  @IsString()
  @IsNotEmpty()
  providerCode: string;

  @IsString()
  @IsNotEmpty()
  gameCode: string;

  @IsString()
  @IsNotEmpty()
  gameName: string;

  @IsString()
  @IsNotEmpty()
  gameName_en: string;

  @IsString()
  gameCategory: string;

  @IsString()
  @IsNotEmpty()
  roundId: string;

  @IsString()
  @IsEnum(EGameTransactionType)
  type: EGameTransactionType;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  referenceUuid: string;

  @IsBoolean()
  roundStarted: boolean;

  @IsBoolean()
  roundFinished: boolean;

  @IsOptional()
  details: string;
}
