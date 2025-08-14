import {VariableItem} from "@core/services/pricing/variable-item/variable-item.interface";
import { SelectFieldOptions } from "./select-field-options/select-field-options.interface";

// Interfaces pour les DTOs
export interface NumericField {
  id: string;
  label: string;
  description: string;
  variableName: string;
  toReturn: boolean;
  managementEntity: string;
  branch: string;
  product: string;
  coverage: string;
  pricingType: string;
}

export interface SelectField {
  id: string;
  label: string;
  description: string;
  variableName: string;
  toReturn: boolean;
  managementEntity: string;
  branch: string;
  product: string;
  coverage: string;
  pricingType: string;
  options: any;
}

export enum FieldType {
  NUMBER = 'NUMERIC_FIELD',
  SELECT = 'SELECT_FIELD',
}

export class Field extends VariableItem {

    type: FieldType;
    options: SelectFieldOptions | null;
    // value: SelectFieldOptionValue | number | null;

    /**
     * Field constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        super(response);
        this.type = response?.type ?? FieldType.NUMBER; // Default to NUMBER if not specified
        this.options = response?.options ? new SelectFieldOptions(response.options) : null;
        // this.value = response?.value ? 0 : null;
    }
}
