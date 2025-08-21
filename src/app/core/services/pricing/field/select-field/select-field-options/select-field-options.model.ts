import {
  SelectFieldOptionValue
} from "@core/services/pricing/field/select-field/select-field-option-value/select-field-option-value.model";

export class SelectFieldOptions {
  id: string;
  label: string;
  name: string;
  description: string;
  possibilities: SelectFieldOptionValue[];

  constructor(response: Partial<SelectFieldOptions> = {}) {
    Object.assign(this, response);
    this.id = response?.id ?? '';
    this.label = response?.label ?? '';
    this.name = response?.name ?? '';
    this.description = response?.description ?? '';
    this.possibilities = response?.possibilities?.map((item: any) => new SelectFieldOptionValue(item)) ?? [];
  }
}
