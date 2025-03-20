
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';


export class AttestationLot {
    
    id: string = '';
    prefix: string = '';
    quantity: number = 0;
    stock: number = 0;
    startDate: string = '';
    endDate: string = '';
    proprietor: ManagementEntity = new ManagementEntity({});
    deliverer: string = '';

    constructor(attestation: any) {
        this.id = attestation?.id || '';
        this.quantity = attestation?.quantity || 0;
        this.stock = attestation?.stock || 0;
        this.proprietor = new ManagementEntity(attestation?.proprietor || {});
        this.prefix = attestation?.prefix || '';
        this.startDate = attestation?.startDate || '';
        this.endDate = attestation?.endDate || '';
        this.deliverer = attestation?.deliverer || '';
    }
}

export class Attestation extends AttestationLot {

    constructor(attestation: any) {
        super(attestation);
    }
}