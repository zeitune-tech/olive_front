import { Product } from "../product/product.interface";

export class Endorsment {
  id: string;
  designation: string;
  nature: string;
  product: Product[];

  constructor(data: any) {
    this.id = data.id || '';
    this.designation = data.designation || '';
    this.nature = data.nature || '';
    this.product = data.product || [];
  }
}