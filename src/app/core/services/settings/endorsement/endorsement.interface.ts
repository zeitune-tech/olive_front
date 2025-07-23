export class Endorsment {
  id: string;
  name: string;
  nature: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.nature = data.nature || '';
  }
}