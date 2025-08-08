import { ManagementEntity } from "../management-entity/management-entity.interface";

export const  ContributorLevel = {
    COMPANY : 'COMPANY',
    POINT_OF_SALE : 'POINT_OF_SALE',
}


export class ContributorType {
   
    id: string;
    label: string;

    constructor(data: any) {
        this.id = data.id || '';
        this.label = data.label || '';
    }
}

export class Contributor {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    level: typeof ContributorLevel[keyof typeof ContributorLevel];
    contributorType: ContributorType
    managementEntity: ManagementEntity;

    constructor(data: any) {
        this.id = data.id || '';
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.phone = data.gsm || '';
        this.level = data.level || ContributorLevel.COMPANY; // Valeur par défaut à adapter
        this.managementEntity = data.managementEntity ? new ManagementEntity(data.managementEntity) : new ManagementEntity({});
        this.contributorType = data.contributorType ? new ContributorType(data.contributorType) : new ContributorType({});
    }
}