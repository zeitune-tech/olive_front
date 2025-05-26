export const  ContributorLevel = {
    COMPANY : 'COMPANY',
    POINT_OF_SALE : 'POINT_OF_SALE',
}


export class Contributor {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    level: typeof ContributorLevel[keyof typeof ContributorLevel];
    managementEntity: string;

    constructor(data: any) {
        this.id = data.id || '';
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.level = data.level || ContributorLevel.COMPANY; // Valeur par défaut à adapter
        this.managementEntity = data.managementEntity || '';
    }
}
