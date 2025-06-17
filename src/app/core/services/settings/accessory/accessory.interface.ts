import { Product } from "@core/services/settings/product/product.interface";

export const  AccessoryType = {
  NEW_BUSINESS: 'NEW_BUSINESS',
  MODIFICATION: 'MODIFICATION',
  SUSPENSION: 'SUSPENSION',
  REINSTATEMENT: 'REINSTATEMENT'
}

export class Accessory {
  id: string;
  dateEffective: string;
  actType: string;
  accessoryAmount: number;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.actType = data.actType || '';
    this.accessoryAmount = data.accessoryAmount ?? 0;
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
