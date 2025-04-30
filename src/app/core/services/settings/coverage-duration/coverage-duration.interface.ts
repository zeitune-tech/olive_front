export class CoverageDuration {
    type: string;
    unit: string;
    from: number;
    to: number;
    prorotaMode: string;
    managementEntity: string;
  
    constructor(coverageDuration: any) {
      this.type = coverageDuration.type || null;
      this.unit = coverageDuration.unit || null;
      this.from = coverageDuration.from || null;
      this.to = coverageDuration.to || null;
      this.prorotaMode = coverageDuration.prorotaMode || null;
      this.managementEntity = coverageDuration.managementEntity || null;
    }
  }
  