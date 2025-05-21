export class Commission {
  id: string;
  dateEffective: string;
  calculationBase: string;
  managementRate: number;
  contributionRate: number;
  pointOfSale: string;
  product: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.calculationBase = data.calculationBase || '';
    this.managementRate = data.managementRate ?? 0;
    this.contributionRate = data.contributionRate ?? 0;
    this.pointOfSale = data.pointOfSale || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
