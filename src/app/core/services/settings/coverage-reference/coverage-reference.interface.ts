export class CoverageReference {
    designation: string;
    family: string;
    accessCharacteristic: boolean;
    tariffAccess: boolean;
    managementEntity: string;
  
    constructor(coverageReference: any) {
      this.designation = coverageReference.designation || '';
      this.family = coverageReference.family || '';
      this.accessCharacteristic = coverageReference.accessCharacteristic ?? false;
      this.tariffAccess = coverageReference.tariffAccess ?? false;
      this.managementEntity = coverageReference.managementEntity || '';
    }
  }
  