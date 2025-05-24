export class DurationRate {
  id: string;
  dateEffective: string;
  durationId: string;
  rate: number;
  productId: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.durationId = data.duration || '';
    this.rate = data.rate ?? 0;
    this.productId = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
