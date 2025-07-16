import { Contributor } from "@core/services/administration/contributor/contributor.interface";

// export interface TaxCommissionsContributor {
//   id: string; // UUID sous forme de string
//   dateEffective: string; // ISO date string, e.g. "2025-07-01"
//   rate: number | null;
//   toWithhold: boolean | null;
//   managementEntity: string;
//   contributor: Contributor;
//   contributorType: string;
// }


export class TaxCommissionsContributor {
  id: string; // UUID sous forme de string
  dateEffective: string; // ISO date string, e.g. "2025-07-01"
  rate: number | null;
  toWithhold: boolean | null;
  managementEntity: string;
  contributor: Contributor;
  contributorType: "BROKER" | "GENERAL_AGENT" | "DIRECT_OFFICE";

  constructor(data: Partial<TaxCommissionsContributor> = {}) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.rate = data.rate || null;
    this.toWithhold = data.toWithhold || null;
    this.managementEntity = data.managementEntity || '';
    this.contributor = data.contributor || new Contributor({});
    this.contributorType = data.contributorType || "BROKER"; // Default to "BROKER" if not provided
    Object.assign(this, data);
  }
}