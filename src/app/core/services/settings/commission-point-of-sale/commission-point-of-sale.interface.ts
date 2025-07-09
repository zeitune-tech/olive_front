import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { Coverage } from "../coverage/coverage.interface";
import { Product } from "../product/product.interface";

export interface CommissionPointOfSale {
  id: string; // UUID sous forme de string
  dateEffective: string;
  calculationBase: string;
  managementRate: number | null;
  contributionRate: number | null;
  typePointOfSale: string;
  product: Product;
  coverage: Coverage;
  pointOfSale: PointOfSale;
}
