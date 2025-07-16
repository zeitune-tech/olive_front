import { Product } from '../product/product.interface';
import { Tax } from '../tax/tax.interface';

export interface TaxExemption {
  id: string;
  name: string;
  taxes: Tax[];
  product: Product;
}