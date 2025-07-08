import { Product } from "@core/services/settings/product/product.interface";
import { Endorsment } from "../endorsement/endorsement.interface";

export class Accessory {
  id: string;
  dateEffective: string;
  actType: Endorsment;
  accessoryType: string;
  accessoryAmount: number;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.actType = data.actType || '';
    this.accessoryType = data.accessoryType || '';
    this.accessoryAmount = data.accessoryAmount ?? 0;
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
