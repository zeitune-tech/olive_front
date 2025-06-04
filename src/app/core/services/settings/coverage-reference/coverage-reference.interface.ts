export class CoverageReference {
    id: string;
    designation: string;
    family: string;
    accessCharacteristic: boolean;
    tariffAccess: boolean;
    toShareOut: boolean;
    managementEntity: string;
  
    constructor(coverageReference: any) {
      this.id = coverageReference.id || '';
      this.designation = coverageReference.designation || '';
      this.family = coverageReference.family || '';
      this.accessCharacteristic = coverageReference.accessCharacteristic ?? false;
      this.tariffAccess = coverageReference.tariffAccess ?? false;
      this.toShareOut = coverageReference.toShareOut ?? false;
      this.managementEntity = coverageReference.managementEntity || '';
    }
  }
  