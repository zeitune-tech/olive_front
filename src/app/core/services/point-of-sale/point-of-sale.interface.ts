import { ManagementEntity } from "../management-entity/management-entity.interface";

export class PointOfSale extends ManagementEntity {
    
    constructor(entity: any) {
        super(entity);
    }
}

export class BrokerPointOfSale extends PointOfSale {
    linked: boolean = false;
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
    }
}