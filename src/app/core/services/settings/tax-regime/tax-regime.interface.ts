import { Tax } from "../tax/tax.interface";

export class TaxRegime {
  uuid: string;
  designation: string;
  nature: 'EXCEPTIONAL' | 'NORMAL';
  stampExemption: boolean;
  exemptedTaxes: Tax[];
  managementEntity: string;

  constructor(data: any) {
    this.uuid = data.uuid || '';
    this.designation = data.designation || '';
    this.nature = data.nature || 'NORMAL';
    this.stampExemption = data.stampExemption ?? false;
    this.exemptedTaxes = data.exemptedTaxes || [];
    this.managementEntity = data.managementEntity || '';
  }
}
