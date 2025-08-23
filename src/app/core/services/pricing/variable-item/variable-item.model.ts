export enum TypeOfVariable {
  CONSTANT = "CONSTANT",                // Constant variable
  NUMERIC_FIELD = "NUMERIC_FIELD",            // Numeric variable
  SELECT_FIELD = "SELECT_FIELD",       // Select field variable
  VARIABLE_CONDITION = "VARIABLE_CONDITION",       // Variable condition
  FORMULA = "FORMULA",                  // Formula variable
}

export class VariableItem {
  id: string;
  label: string;
  description: string;
  variableName: string;
  toReturn: boolean;
  managementEntity: string;
  branch: string;
  product: string;
  pricingType: string;
  coverage: string;
  type?: TypeOfVariable

  constructor(entity: Partial<VariableItem> = {}) {
    Object.assign(this, entity);
    this.id = entity?.id ?? '';
    this.label = entity?.label ?? '';
    this.description = entity?.description ?? '';
    this.variableName = entity?.variableName ?? '';
    this.toReturn = entity?.toReturn ?? false;
    this.managementEntity = entity?.managementEntity ?? '';
    this.branch = entity?.branch ?? '';
    this.product = entity?.product ?? '';
    this.pricingType = entity?.pricingType ?? '';
    this.coverage = entity?.coverage ?? '';
    this.type = entity?.type; // Default to CONSTANT if not provided
  }
}
