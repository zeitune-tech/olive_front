import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { Product } from "@core/services/administration/product/product.interface";

export class Commission {
  id: string;
  dateEffective: string;
  calculationBase: string;
  managementRate: number;
  contributionRate: number;
  pointOfSale: PointOfSale;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.calculationBase = data.calculationBase || '';
    this.managementRate = data.managementRate ?? 0;
    this.contributionRate = data.contributionRate ?? 0;
    this.pointOfSale = data.pointOfSale || new PointOfSale({});
    this.product = data.product || new Product({});
    this.managementEntity = data.managementEntity || '';
  }
}
