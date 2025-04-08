export class IncompatibleCoverage {
    id: string;
    coverage: string;
    incompatibleCoverage: string;
    managementEntity: string;
  
    constructor(incompatibleCoverage: any) {
      this.id = incompatibleCoverage.id || '';
      this.coverage = incompatibleCoverage.coverage || '';
      this.incompatibleCoverage = incompatibleCoverage.incompatibleCoverage || '';
      this.managementEntity = incompatibleCoverage.managementEntity || '';
    }
  }
  