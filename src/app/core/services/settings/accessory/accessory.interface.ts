export class Accessory {
  id: string;
  dateEffective: string;
  actType: string;
  accessoryAmount: number;
  product: string;
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
