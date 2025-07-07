import { Product } from "@core/services/settings/product/product.interface";

export class ProductionRegistry {
    id: string;
    prefix: string;
    length: number;
    managementEntity: string;
    product: Product;
    counter: number;

    constructor(productionRegistry: any) {
        this.id = productionRegistry.id || '';
        this.prefix = productionRegistry.prefix || '';
        this.length = productionRegistry.length || 0;
        this.managementEntity = productionRegistry.managementEntity || '';
        this.product = productionRegistry.product || new Product({});
        this.counter = productionRegistry.counter || 0;
    }
}