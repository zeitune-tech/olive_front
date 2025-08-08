import { ManagementEntity } from "../management-entity/management-entity.interface";


export class Company extends ManagementEntity {

    linked: boolean = false;
    legalStatus?: string;
    regulation?: string;
    agreementRef?: string;
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
    }
}