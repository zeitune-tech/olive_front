export class DurationRate {
  id: string;
  dateEffective: string;
  duration: string;
  rate: number;
  product: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.duration = data.duration || '';
    this.rate = data.rate ?? 0;
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
