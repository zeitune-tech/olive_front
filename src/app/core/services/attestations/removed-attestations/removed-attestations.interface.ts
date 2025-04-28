import { LotAttestation } from "../lot-attestation/lot-attestation.interface";

export class RemovedAttestations extends LotAttestation {
    constructor(lotAttestation: Partial<RemovedAttestations>) {
        super(lotAttestation);
    }
}