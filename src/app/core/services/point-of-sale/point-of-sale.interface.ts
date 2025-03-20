import { ManagementEntity } from "../management-entity/management-entity.interface";

export class PointOfSale extends ManagementEntity {

    linked?: boolean = false;
    type?: "GENERAL_AGENT" | "DIRECT_OFFICE" | "BROKER" = 'GENERAL_AGENT';
    
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
        this.level = 'POINT_OF_SALE';
    }
}