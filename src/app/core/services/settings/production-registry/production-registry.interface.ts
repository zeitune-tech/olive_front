
export class ProductionRegistry {
    prefix: string;
    length: number;
    managementEntity: string;
    product: string;
    counter: number;

    constructor(productionRegistry: any) {
        this.prefix = productionRegistry.prefix || '';
        this.length = productionRegistry.length || 0;
        this.managementEntity = productionRegistry.managementEntity || '';
        this.product = productionRegistry.product || '';
        this.counter = productionRegistry.counter || 0;
    }
}