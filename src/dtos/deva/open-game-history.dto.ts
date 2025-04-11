import {
  IsOptional,
  IsString,
  IsISO31661Alpha2,
  Length,
  IsIn,
} from "class-validator";

export class OpenGameHistoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 80)
  uuid?: string;

  @IsOptional()
  @IsString()
  @Length(1, 31)
  providerCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 70)
  roundId?: string;

  @IsString()
  @IsISO31661Alpha2()
  countryCode: string;

  @IsString()
  @Length(2, 2)
  @IsIn(["en", "fr", "it", "ko", "ja"])
  localeCode: string;
}
