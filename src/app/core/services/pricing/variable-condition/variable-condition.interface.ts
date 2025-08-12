import {VariableItem} from "@core/services/pricing/variable-item/variable-item.interface";
import { Rule } from "./rule/rule.interface";

export class VariableCondition extends VariableItem {

    /**
     * Properties of the variable condition
     */
    coverage: string;
    rules: Rule[];

    /**
     * VariableCondition constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        super(response);
        this.rules = response?.rules ?? [];
        this.coverage = response?.coverage ?? '';
    }
}
