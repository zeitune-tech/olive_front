import { Product } from "@core/services/settings/product/product.interface";
import { Endorsment } from "../endorsement/endorsement.interface";

export class Accessory {
  id: string;
  dateEffective: string;
  actType: Endorsment;
  accessoryRisk: number;
  accessoryPolice: number;
  product: Product;
  effectiveDate: Date;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.actType = data.actType || '';
    this.accessoryRisk = data.accessoryRisk || 0;
    this.accessoryPolice = data.accessoryPolice || 0;
    this.product = data.product || '';
    this.effectiveDate = data.effectiveDate ? new Date(data.effectiveDate) : new Date();
    this.managementEntity = data.managementEntity || '';
  }
}
