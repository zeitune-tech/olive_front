import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { Coverage } from "../coverage/coverage.interface";
import { Product } from "../product/product.interface";

// export interface CommissionPointOfSale {
//   id: string; // UUID sous forme de string
//   dateEffective: string;
//   calculationBase: string;
//   managementRate: number | null;
//   contributionRate: number | null;
//   typePointOfSale: string;
//   product: Product;
//   coverage: Coverage;
//   pointOfSale: PointOfSale;
// }

export class CommissionPointOfSale {
  id: string; // UUID sous forme de string
  dateEffective: string;
  calculationBase: string;
  managementRate: number | null;
  contributionRate: number | null;
  pointOfSaleType	: string;
  product: Product;
  coverage: Coverage;
  pointOfSale: PointOfSale;

  constructor(data: Partial<CommissionPointOfSale>) {
  
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.calculationBase = data.calculationBase || '';
    this.managementRate = data.managementRate || null;
    this.contributionRate = data.contributionRate || null;
    this.pointOfSaleType	 = data.pointOfSaleType	 || '';
    this.product = data.product || new Product({});
    this.coverage = data.coverage || new Coverage({});
    this.pointOfSale = data.pointOfSale || new PointOfSale({});
  }
}
