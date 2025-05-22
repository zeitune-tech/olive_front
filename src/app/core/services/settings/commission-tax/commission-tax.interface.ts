import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { Product } from "@core/services/administration/product/product.interface";

export class CommissionTax {
  id: string;
  dateEffective: string;
  commissionTaxType: string;
  rate: number;
  pointOfSale: PointOfSale;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.commissionTaxType = data.commissionTaxType || '';
    this.rate = data.rate ?? 0;
    this.pointOfSale = data.pointOfSale || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
