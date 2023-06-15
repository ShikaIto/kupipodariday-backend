import { IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  readonly amount: number;

  @IsNotEmpty()
  readonly hidden: boolean;

  @IsNotEmpty()
  readonly itemId: number;
}
