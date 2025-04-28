import { LotAttestation } from "../lot-attestation/lot-attestation.interface";


export class CompanyAttestations  extends LotAttestation {

    constructor(lotAttestation: Partial<CompanyAttestations>) {
        super(lotAttestation);
    }
}