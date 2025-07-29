import { Product } from "../product/product.interface";

export class Endorsment {
  id: string;
  name: string;
  nature: string;
  product: Product[];

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.nature = data.nature || '';
    this.product = data.product || [];
  }
}