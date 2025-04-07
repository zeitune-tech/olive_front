export class Coverage {
    nature: string;
    isFree: boolean;
    isFixed: boolean;
    calculationMode: string;
    fixedCapital: number;
    minCapital: number;
    maxCapital: number;
    order: number;
    prorata: string;
    displayPrime: boolean;
    generatesCharacteristic: boolean;
    coverageReferenceId: string;
    product: string;
    managementEntity: string;
  
    constructor(coverage: any) {
      this.nature = coverage.nature || '';
      this.isFree = coverage.isFree ?? false;
      this.isFixed = coverage.isFixed ?? false;
      this.calculationMode = coverage.calculationMode || '';
      this.fixedCapital = coverage.fixedCapital ?? 0;
      this.minCapital = coverage.minCapital ?? 0;
      this.maxCapital = coverage.maxCapital ?? 0;
      this.order = coverage.order ?? 0;
      this.prorata = coverage.prorata || '';
      this.displayPrime = coverage.displayPrime ?? false;
      this.generatesCharacteristic = coverage.generatesCharacteristic ?? false;
      this.coverageReferenceId = coverage.coverageReferenceId || '';
      this.product = coverage.product || '';
      this.managementEntity = coverage.managementEntity || '';
    }
  }
  