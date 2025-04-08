import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ERole } from "../../constants/role.enum";

export class SignUpDto {
  @IsString()
  @MinLength(3)
  userName: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(ERole)
  @IsOptional()
  role: ERole;
}
