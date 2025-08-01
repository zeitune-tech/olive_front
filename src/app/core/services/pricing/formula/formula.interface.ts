import {VariableItem} from "@core/services/pricing/variable-item/variable-item.interface";

export class Formula extends VariableItem {
    /**
     * Type of the variable item
     */
    expression: string;
    variables: VariableItem

    /**
     * Constant constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        super(response);
        this.expression = response?.expression ?? '';
        this.variables = response?.variables ?? new VariableItem({});
    }
}
