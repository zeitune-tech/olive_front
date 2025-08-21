import {Field} from "@core/services/pricing/field/field.model";
import {FieldType} from "@core/services/pricing/enum/field-type.enum";

export class NumericField extends Field {
  constructor(response: Partial<NumericField> = {}) {
    super(response);
    Object.assign(this, response);
    this.fieldType = FieldType.NUMBER; // Ensure fieldType is also set to NUM
  }
}
