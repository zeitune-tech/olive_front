import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";


export class Restriction {
    id: string = '';
    type: string = '';
    entity!: ManagementEntity;

    constructor(restriction?: Partial<Restriction>) {
        Object.assign(this, restriction);
    }
}