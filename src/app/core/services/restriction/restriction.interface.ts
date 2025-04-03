import { ManagementEntity } from "../management-entity/management-entity.interface";


export class Restriction {
    id: string = '';
    type: string = '';
    entity!: ManagementEntity;

    constructor(restriction?: Partial<Restriction>) {
        Object.assign(this, restriction);
    }
}