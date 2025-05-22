import { Product } from "@core/services/administration/product/product.interface";
import { Tax } from "../tax/tax.interface";
import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { CoverageReference } from "../coverage-reference/coverage-reference.interface";

export class BaseTax {
  id: string;
  dateEffective: string;
  calculationBase: string;
  isFlat: boolean;
  rate: number;
  fixedAmount: number;
  tax: Tax;
  coverage: CoverageReference;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.calculationBase = data.calculationBase || '';
    this.isFlat = data.isFlat ?? false;
    this.rate = data.rate ?? 0;
    this.fixedAmount = data.fixedAmount ?? 0;
    this.tax = data.tax || '';
    this.coverage = data.coverage || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
