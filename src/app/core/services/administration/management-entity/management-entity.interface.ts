

export class ManagementEntity {

    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    type: "MARKET_LEVEL_ORGANIZATION" | "COMPANY" | "POINT_OF_SALE";
    superiorEntity?: ManagementEntity;

    constructor(entity: any) {
        this.id = entity?.id || '';
        this.code = entity?.code || '';
        this.name = entity?.name || '';
        this.type = entity?.type || '';
        this.logo = entity?.logo || '';
        this.email = entity?.email || '';
        this.phone = entity?.phone || '';
        this.address = entity?.address || '';
        this.superiorEntity = entity?.superiorEntity ? new ManagementEntity(entity.superiorEntity) : undefined;
    }

}