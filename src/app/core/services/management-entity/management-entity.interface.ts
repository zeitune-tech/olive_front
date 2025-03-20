

export const ManagementEntityTypes = {
    ENTITY_SUPERIOR: 'ENTITY_SUPERIOR',
    COMPANY: 'COMPANY',
    BROKER: 'POINT_OF_SALE'
}

export class ManagementEntity {

    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    level: "ENTITY_SUPERIOR" | "COMPANY" | "POINT_OF_SALE";

    constructor(entity: any) {
        this.id = entity?.id || '';
        this.name = entity?.name || '';
        this.level = entity?.level || '';
        this.logo = entity?.logo || '';
        this.email = entity?.email || '';
        this.phone = entity?.phone || '';
        this.address = entity?.address || '';
    }

}