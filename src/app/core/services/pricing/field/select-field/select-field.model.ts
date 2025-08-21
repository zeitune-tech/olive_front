import {SelectFieldOptions} from "./select-field-options/select-field-options.model";
import {Field} from "@core/services/pricing/field/field.model";
import {FieldType} from "@core/services/pricing/enum/field-type.enum";

export class SelectField extends Field {
  options: SelectFieldOptions;

  constructor(response: Partial<SelectField> = {}) {
    super(response);
    Object.assign(this, response);
    this.fieldType = FieldType.SELECT
    this.options = response?.options || new SelectFieldOptions({});
  }
}
