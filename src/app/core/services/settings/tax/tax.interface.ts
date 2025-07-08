
export class Tax {
  id: string;
  designation: string;
  nature: string;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.designation = data.designation || '';
    this.nature = data.nature || '';
    this.managementEntity = data.managementEntity || '';
  }
}
