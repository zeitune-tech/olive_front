
export class ProductionRegistry {
    prefix: string;
    length: number;
    managementEntity: string;

    constructor(productionRegistry: any) {
        this.prefix = productionRegistry.prefix || '';
        this.length = productionRegistry.length || 0;
        this.managementEntity = productionRegistry.managementEntity || '';
    }
}