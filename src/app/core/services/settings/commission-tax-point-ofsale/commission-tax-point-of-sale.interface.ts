import { PointOfSale } from "@core/services/administration/point-of-sale/point-of-sale.interface";

export interface TaxCommissionsPointOfSale {
  id: string; // UUID sous forme de string
  dateEffective: string; // ISO date string, e.g. "2025-07-01"
  rate: number | null;
  toWithhold: boolean | null;
  managementEntity: string;
  pointOfSale: PointOfSale;
  pointOfSaleType: "BROKER" | "GENERAL_AGENT" | "DIRECT_OFFICE";
}
