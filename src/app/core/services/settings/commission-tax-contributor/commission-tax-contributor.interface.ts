import { Contributor, ContributorType } from "@core/services/administration/contributor/contributor.interface";
import { Product } from "../product/product.interface";

export class TaxCommissionsContributor {
  id: string; // UUID sous forme de string
  dateEffective: string; // ISO date string, e.g. "2025-07-01"
  rate: number | null;
  toWithhold: boolean | null;
  managementEntity: string;
  contributor: Contributor;
  product: Product;
  contributorType: ContributorType;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.rate = data.rate || null;
    this.toWithhold = data.toWithhold || null;
    this.managementEntity = data.managementEntity || '';
    this.contributor = data.contributor || new Contributor({});
    this.product = data.product || new Product({});
    this.contributorType = data.contributorType || new ContributorType({});
    Object.assign(this, data);
  }
}