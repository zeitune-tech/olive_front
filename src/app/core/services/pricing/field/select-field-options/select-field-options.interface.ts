import {SelectFieldOptionValue} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.interface";

export class SelectFieldOptions {

    id: string;
    label: string;
    name: string;
    description: string;
    possibilities: SelectFieldOptionValue[];

    /**
     * SelectFieldOptions constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        this.id = response?.id ?? '';
        this.label = response?.label ?? '';
        this.name = response?.name ?? '';
        this.description = response?.description ?? '';
        this.possibilities = response?.possibilities?.map((item: any) => new SelectFieldOptionValue(item)) ?? [];
    }

}
