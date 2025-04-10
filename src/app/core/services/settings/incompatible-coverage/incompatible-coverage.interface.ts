import { CoverageReference } from "../coverage-reference/coverage-reference.interface";

export class IncompatibleCoverage {
    id: string;
    coverage: CoverageReference;
    incompatibleCoverage: CoverageReference;
    managementEntity: string;
  
    constructor(incompatibleCoverage: any) {
      this.id = incompatibleCoverage.id || '';
      this.coverage = incompatibleCoverage.coverage || '';
      this.incompatibleCoverage = incompatibleCoverage.incompatibleCoverage || '';
      this.managementEntity = incompatibleCoverage.managementEntity || '';
    }
  }
  