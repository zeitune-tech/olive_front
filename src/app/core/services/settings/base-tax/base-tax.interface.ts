export class BaseTax {
  id: string;
  dateEffective: string;
  calculationBase: string;
  isFlat: boolean;
  rate: number;
  fixedAmount: number;
  tax: string;
  coverage: string;
  pointOfSale: string;
  product: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.calculationBase = data.calculationBase || '';
    this.isFlat = data.isFlat ?? false;
    this.rate = data.rate ?? 0;
    this.fixedAmount = data.fixedAmount ?? 0;
    this.tax = data.tax || '';
    this.coverage = data.coverage || '';
    this.pointOfSale = data.pointOfSale || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
