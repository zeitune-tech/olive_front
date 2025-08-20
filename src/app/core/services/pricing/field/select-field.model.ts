import {VariableItem} from "@core/services/pricing/variable-item/variable-item.interface";
import { SelectFieldOptions } from "./select-field-options/select-field-options.interface";
import {TariffableAttribut} from "@core/services/pricing/tariffable-attribut/tariffable-attribut.model";
import {Field} from "@core/services/pricing/field/field.interface";

export class SelectField extends Field {
  options: SelectFieldOptions | null;

  constructor(entity:any) {
    super(entity);
    this.options = entity.options;
  }

}
