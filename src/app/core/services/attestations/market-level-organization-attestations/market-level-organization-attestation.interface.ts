import { LotAttestation } from "../lot-attestation/lot-attestation.interface";

export class MarketLevelOrganizationAttestations extends LotAttestation {

    constructor(lotAttestation: Partial<MarketLevelOrganizationAttestations>) {
        super(lotAttestation);
    }
}