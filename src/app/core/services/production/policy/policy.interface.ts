export interface PoliceResponse {
  uuid: string;
  numPolice?: string;
  companyUuid?: string;
  pointOfSaleUuid?: string;
  productUuid?: string;
  insuredUuid?: string;
  riskUuid?: string;
  statusPolice?: string;
  dateEffet?: string;
  echeance?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PoliceCreateRequest = Partial<PoliceResponse> & {
  companyUuid: string;
  pointOfSaleUuid: string;
  productUuid: string;
};

