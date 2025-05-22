import { Product } from "@core/services/administration/product/product.interface";

export class Tax {
  id: string;
  designation: string;
  rgr: string;
  nature: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.designation = data.designation || '';
    this.rgr = data.rgr || '';
    this.nature = data.nature || '';
    this.managementEntity = data.managementEntity || '';
  }
}
