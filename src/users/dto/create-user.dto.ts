import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegExHelper } from 'src/helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @Matches(RegExHelper.password)
  @IsNotEmpty()
  password: string;
}
