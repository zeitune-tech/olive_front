import {NumericField, SelectField} from "@core/services/pricing/field/field.interface";
import {SelectFieldOptionValue} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.interface";

export interface NumericalCondition {
    value: number;
    numericField: NumericField; // Replace with actual type if available
    operator: "LESS_THAN" | "GREATER_THAN" | "EQUALS" | "NOT_EQUALS" | "GREATER_OR_EQUAL" | "LESS_OR_EQUAL";
    minValue: number;
    maxValue: number;
}

export interface SelectFieldCondition {
  value: SelectFieldOptionValue; // Replace with actual type if available
  selectField: SelectField; // Replace with actual type if available
  operator: "EQUALS" | "NOT_EQUALS";
}

export class Condition {
    /**
     * Type of the variable item
     */
    // UUID id,
    // Double value,
    // NumericFieldResponseDTO numericField,
    // NumericOperator operator

    id: string; // UUID
    type: "NUMBER" | "SELECT";
    field: NumericField | SelectField; // Replace with actual type if available

    /**
     * VariableCondition constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        this.id = response?.id ?? '';
        this.type = response?.type ?? '';
        this.field = response?.field ?? response?.numericField; // Assuming field can be either NumericField or SelectField
    }
}
