import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";
import { Product } from "../product/product.interface";

export class TaxCommissionsPointOfSale {
  id: string; // UUID sous forme de string
  dateEffective: string; // ISO date string, e.g. "2025-07-01"
  rate: number | null;
  toWithhold: boolean | null;
  managementEntity: string;
  pointOfSale: PointOfSale;
  pointOfSaleType: "BROKER" | "GENERAL_AGENT" | "DIRECT_OFFICE";
  product: Product;

  constructor(data: Partial<TaxCommissionsPointOfSale> = {}) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.rate = data.rate || null;
    this.toWithhold = data.toWithhold || null;
    this.managementEntity = data.managementEntity || '';
    this.pointOfSale = data.pointOfSale || new PointOfSale({});
    this.product = data.product || new Product({});
    this.pointOfSaleType = data.pointOfSaleType || "BROKER"; // Default to "BROKER" if not provided
    Object.assign(this, data);
  }
}
