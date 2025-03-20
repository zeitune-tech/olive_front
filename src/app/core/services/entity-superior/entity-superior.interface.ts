import { ManagementEntity } from "../management-entity/management-entity.interface";

export class EntitySuperior extends ManagementEntity {

    linked: boolean = false;
    
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
    }
}