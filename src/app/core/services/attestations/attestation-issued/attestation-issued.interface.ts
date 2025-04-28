

export class AttestationIssued {

    id: number;
    lotId: number;
    lotAttestationId: number;
    issuedAt: Date;
    issuedBy: string;
    issuedTo: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(attestationIssued: Partial<AttestationIssued>) {
        Object.assign(this, attestationIssued);
        this.id = attestationIssued.id || 0;
        this.lotId = attestationIssued.lotId || 0;
        this.lotAttestationId = attestationIssued.lotAttestationId || 0;
        this.issuedAt = attestationIssued.issuedAt || new Date();
        this.issuedBy = attestationIssued.issuedBy || '';
        this.issuedTo = attestationIssued.issuedTo || '';
        this.status = attestationIssued.status || '';
        this.createdAt = attestationIssued.createdAt || new Date();
        this.updatedAt = attestationIssued.updatedAt || new Date();
    }
}