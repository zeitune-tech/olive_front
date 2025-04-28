

export class LotAttestation {
    id: string;
    managementEntity: string;
    product: string;

    prefix: string;
    pileStart: number;
    pileEnd: number;
    quantity: number;
    stock: number;

    startDate: Date;
    endDate: Date;

    createdAt: Date;
    updatedAt: Date;

    constructor( lotAttestation: any) {
        this.id = lotAttestation.id || '';
        this.managementEntity = lotAttestation.managementEntity || '';
        this.product = lotAttestation.product || '';

        this.prefix = lotAttestation.prefix || '';
        this.pileStart = lotAttestation.pileStart || 0;
        this.pileEnd = lotAttestation.pileEnd || 0;
        this.quantity = lotAttestation.quantity || 0;
        this.stock = lotAttestation.stock || 0;

        this.startDate = lotAttestation.startDate || new Date();
        this.endDate = lotAttestation.endDate || new Date();

        this.createdAt = lotAttestation.createdAt || new Date();
        this.updatedAt = lotAttestation.updatedAt || new Date();
    }
}