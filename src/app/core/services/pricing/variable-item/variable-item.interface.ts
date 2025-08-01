// UUID id,
// String label,
// String description,
// String variableName,
// Boolean toReturn,
// UUID managementEntity,
// UUID product,
// UUID coverage,

export class VariableItem {
    id: string;
    label: string;
    description: string;
    variableName: string;
    toReturn: boolean;
    managementEntity: string;
    product: string;
    coverage: string;

    constructor(entity: any) {
        this.id = entity?.id ?? '';
        this.label = entity?.label ?? '';
        this.description = entity?.description ?? '';
        this.variableName = entity?.variableName ?? '';
        this.toReturn = entity?.toReturn ?? false;
        this.managementEntity = entity?.managementEntity ?? '';
        this.product = entity?.product ?? '';
        this.coverage = entity?.coverage ?? '';
    }
}
