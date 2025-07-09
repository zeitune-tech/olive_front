import { Coverage } from "../coverage/coverage.interface";
import { Product } from "../product/product.interface";
import { TaxType } from "../tax-type/tax-type.interface";

export interface TaxPrime {
  id: string;
  name: string;
  dateEffective: string; 
  calculationBase: string;
  isFlatRate: boolean;
  flatRateAmount: number | null;
  rate: number | null;
  taxType: TaxType;
  coverage: Coverage;
  product: Product;
}
