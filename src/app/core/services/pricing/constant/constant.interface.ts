import {VariableItem} from "@core/services/pricing/variable-item/variable-item.interface";

export class Constant extends VariableItem {
    /**
     * Type of the variable item
     */
    value: number;

    /**
     * Constant constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        super(response);
        this.value = response?.value ?? 0;
    }
}
