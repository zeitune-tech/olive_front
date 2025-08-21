import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";

export class Constant extends VariableItem {
  value: number;
  /**
   * Constant constructor
   * @param response Response from the server
   */
  constructor(response: Partial<Constant> = {}) {
    super(response);
    Object.assign(this, response);
    this.value = response?.value ?? 0;
  }
}
