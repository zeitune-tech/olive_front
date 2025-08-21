import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";
import {FieldType} from "@core/services/pricing/enum/field-type.enum";

export class Field extends VariableItem {
  fieldType: FieldType;

  /**
   * Field constructor
   * @param response Response from the server
   */
  constructor(response: Partial<Field> = {}) {
    super(response);
    Object.assign(this, response);
    this.fieldType = response?.fieldType ?? FieldType.NUMBER; // Default to NUMBER if not specified
  }
}
