import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";

export class DeclarationField extends VariableItem{
  tariffableObjectName: string;
  tariffableAttribut: string; // FieldType

  constructor(response: Partial<DeclarationField> = {}) {
    super(response);
    Object.assign(this, response);
    this.tariffableObjectName = response.tariffableObjectName || '';
    this.tariffableAttribut = response.tariffableAttribut || ''; // Default to
  }
}
