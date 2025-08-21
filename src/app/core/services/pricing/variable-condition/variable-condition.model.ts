import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";
import {Rule} from "./rule/rule.interface";

export class VariableCondition extends VariableItem {

  /**
   * Properties of the variable condition
   */
  rules: Rule[];

  /**
   * VariableCondition constructor
   * @param response Response from the server
   */
  constructor(response: Partial<VariableCondition> = {}) {
    super(response);
    Object.assign(this, response);
    this.rules = response?.rules ?? [];
  }
}
