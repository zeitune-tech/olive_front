export class CoverageDuration {
  id: string;
    type: "FIXED" | "VARIABLE";
    unit: string;
    from: number;
    to: number;
    designation: string;
    managementEntity: string;
  
    constructor(coverageDuration: any) {
      this.id = coverageDuration.id || '';
      this.type = coverageDuration.type || null;
      this.unit = coverageDuration.unit || null;
      this.from = coverageDuration.from || null;
      this.to = coverageDuration.to || null;
      this.designation = coverageDuration.designation || null;
      this.managementEntity = coverageDuration.managementEntity || null;
    }
  }
  