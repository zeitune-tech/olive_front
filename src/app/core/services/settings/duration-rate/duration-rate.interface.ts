import { Product } from "@core/services/administration/product/product.interface";
import { CoverageDuration } from "../coverage-duration/coverage-duration.interface";

export class DurationRate {
  id: string;
  dateEffective: string;
  duration: CoverageDuration;
  rate: number;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.duration = data.duration || new CoverageDuration({});
    this.rate = data.rate ?? 0;
    this.product = data.product || new Product({});
    this.managementEntity = data.managementEntity || '';
  }
}
