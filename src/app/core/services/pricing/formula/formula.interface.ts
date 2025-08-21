import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";

export class Formula extends VariableItem {
    /**
     * Type of the variable item
     */
    expression: string;
    variables: string[]

    /**
     * Constant constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        super(response);
        this.expression = response?.expression ?? '';
        this.variables = response?.variables ?? [];
    }
}
