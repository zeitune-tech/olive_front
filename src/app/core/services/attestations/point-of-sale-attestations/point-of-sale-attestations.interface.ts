import { LotAttestation } from "../lot-attestation/lot-attestation.interface";

export class PointOfSaleAttestations extends LotAttestation {
    constructor(lotAttestation: Partial<PointOfSaleAttestations>) {
        super(lotAttestation);
    }
}