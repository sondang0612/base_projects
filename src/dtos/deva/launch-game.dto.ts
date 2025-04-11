import {
  IsString,
  IsBoolean,
  IsUrl,
  IsNumber,
  IsIn,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class LaunchGameDto {
  @IsString()
  @IsNotEmpty()
  playerCode: string;

  @IsString()
  @IsNotEmpty()
  providerCode: string;

  @IsString()
  @IsNotEmpty()
  gameCode: string;

  @IsBoolean()
  @Type(() => Boolean)
  isMobile: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  isIframe: boolean;

  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  localeCode: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsUrl()
  lobbyUrl: string;

  @IsNumber()
  @Type(() => Number)
  betLimitMin: number;

  @IsNumber()
  @Type(() => Number)
  betLimitMax: number;

  @IsString()
  playMode: "REAL" | "FUN";
}
