import { Product } from "@core/services/settings/product/product.interface";
import { Endorsment } from "../endorsement/endorsement.interface";

export class Accessory {
  id: string;
  dateEffective: string;
  actType: Endorsment;
  accessoryRisk: number;
  accessoryPolice: number;
  product: Product;
  day: string;
  hour: number;
  minute: number;
  effectiveDate?: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.actType = data.actType || '';
    this.accessoryRisk = data.accessoryRisk || 0;
    this.accessoryPolice = data.accessoryPolice || 0;
    this.product = data.product || '';
    this.day = data.day || '';
    this.hour = data.hour || 0;
    this.minute = data.minute || 0;
    this.effectiveDate = `${this.day} ${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
    this.managementEntity = data.managementEntity || '';
  }
}
