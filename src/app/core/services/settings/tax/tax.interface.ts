export class Tax {
  id: string;
  designation: string;
  rgr: string;
  nature: string;
  pointOfSale: string;
  product: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.designation = data.designation || '';
    this.rgr = data.rgr || '';
    this.nature = data.nature || '';
    this.pointOfSale = data.pointOfSale || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
