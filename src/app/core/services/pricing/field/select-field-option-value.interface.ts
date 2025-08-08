export class SelectFieldOptionValue {
  id: string;
  label: string;
  name: string;
  group: string;

  constructor(response: any) {
    this.id = response?.id ?? '';
    this.label = response?.label ?? '';
    this.name = response?.name ?? '';
    this.group = response?.group ?? '';
  }
}
