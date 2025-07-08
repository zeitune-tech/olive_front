export class Endorsment {
  id: string;
  designation: string;
  nature: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.designation = data.designation || '';
    this.nature = data.nature || '';
  }
}