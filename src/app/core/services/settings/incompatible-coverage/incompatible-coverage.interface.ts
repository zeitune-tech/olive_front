export class IncompatibleCoverage {
    coverageUuid: string;
    incompatibleCoverageUuid: string;
    managementEntity: string;
  
    constructor(incompatibleCoverage: any) {
      this.coverageUuid = incompatibleCoverage.coverageUuid || '';
      this.incompatibleCoverageUuid = incompatibleCoverage.incompatibleCoverageUuid || '';
      this.managementEntity = incompatibleCoverage.managementEntity || '';
    }
  }
  