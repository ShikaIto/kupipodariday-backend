import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  readonly link: string;

  @IsNotEmpty()
  @IsUrl()
  readonly image: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly description: string;
}
