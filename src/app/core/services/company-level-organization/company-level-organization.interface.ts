import { PointOfSale } from "../point-of-sale/point-of-sale.interface";


export class CompanyLevelOrganization {
    id: number = 0;
    name: string = '';
    pointsOfSale: PointOfSale[] = [];
    createdAt: string = '';
    updatedAt: string = '';

    constructor(companyLevelOrganization?: Partial<CompanyLevelOrganization>) {
        Object.assign(this, companyLevelOrganization);
    }
}