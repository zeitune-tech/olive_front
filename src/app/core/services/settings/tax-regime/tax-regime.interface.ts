export class TaxRegime {
  id: string;
  name: string;
  description: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.managementEntity = data.managementEntity || '';
  }
}
