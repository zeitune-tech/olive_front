
export class Rule {
    /**
     * Type of the rule item
     */

    id: string;
    label: string;
    name: string;
    value: number;
    conditions: any[]; // Assuming conditions is an array of objects
    managementEntity?: string; // Optional property for management entity

    /**
     * Rule constructor
     * @param response Response from the server
     */
    constructor(response: any) {
        this.id = response?.id ?? '';
        this.label = response?.label ?? '';
        this.name = response?.name ?? '';
        this.value = response?.value ?? 0;
        this.conditions = response?.conditions ? response.conditions.map((condition: any) => condition) : [];
        this.managementEntity = response?.managementEntity ?? '';
    }
}
