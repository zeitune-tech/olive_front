

export class ManagementEntity {

    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    type: "MARKET_LEVEL_ORGANIZATION" | "COMPANY" | "POINT_OF_SALE";

    constructor(entity: any) {
        this.id = entity?.id || '';
        this.name = entity?.name || '';
        this.type = entity?.type || '';
        this.logo = entity?.logo || '';
        this.email = entity?.email || '';
        this.phone = entity?.phone || '';
        this.address = entity?.address || '';
    }

}