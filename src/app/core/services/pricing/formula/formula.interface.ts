import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";
import {VariableCondition} from "@core/services/pricing/variable-condition/variable-condition.model";
import {Constant} from "@core/services/pricing/constant/constant.model";

export class Formula extends VariableItem {
  /**
   * Type of the variable item
   */
  expression: string;
  variables: VariableItem[]

  /**
   * Constant constructor
   * @param response Response from the server
   */
  constructor(response: any) {
    super(response);
    this.expression = response?.expression ?? '';
    this.variables = response?.variables ?? [];
  }

  public static rewriteExpression(formula: Formula): string {
    let rewrittenExpression = formula.expression;
    formula.variables.forEach(variable => {
      const variablePlaceholder = `{{${variable.variableName}}}`;
      let variableReplacement = '';

      switch (variable.type) {
        case 'CONSTANT':
          variableReplacement = `[ ${new Constant(variable).value} ]`;
          break;
        case 'NUMERIC_FIELD':
        case 'SELECT_FIELD':
          variableReplacement = `[ champ('${variable.label}') ]`;
          break;
        case 'VARIABLE_CONDITION':
          const conditionsLabel = new VariableCondition(variable).rules.map(value => value.label);
          variableReplacement = `[ ${conditionsLabel.join(' || ')} ]`;
          break;
        case 'FORMULA':
          variableReplacement = `[ ${Formula.rewriteExpression(variable as Formula)} ]`;
          break;
        default:
          variableReplacement = `variables['${variable.label}']`
      }
      rewrittenExpression = rewrittenExpression.replaceAll(variablePlaceholder, variableReplacement);
    });
    return rewrittenExpression;

  }
}
