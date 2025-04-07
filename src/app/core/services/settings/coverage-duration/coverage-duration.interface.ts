export class CoverageDuration {
    from: string;
    to: string;
    type: string;
    prorotaMode: string;
    unit: string;
    managementEntity: string;
  
    constructor(coverageDuration: any) {
      this.from = coverageDuration.from || '';
      this.to = coverageDuration.to || '';
      this.type = coverageDuration.type || '';
      this.prorotaMode = coverageDuration.prorotaMode || '';
      this.unit = coverageDuration.unit || '';
      this.managementEntity = coverageDuration.managementEntity || '';
    }
  }
  