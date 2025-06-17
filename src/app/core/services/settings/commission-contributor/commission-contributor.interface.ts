import { Contributor } from "@core/services/administration/contributor/contributor.interface";
import { Product } from "@core/services/settings/product/product.interface";

export class CommissionContributor {
  id: string;
  dateEffective: string;
  commissionBase: string;
  contributorRate: number;
  upperEntityContributorRate: number;
  contributor: Contributor;
  product: Product;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.dateEffective = data.dateEffective || '';
    this.commissionBase = data.commissionBase || '';
    this.contributorRate = data.contributorRate ?? 0;
    this.upperEntityContributorRate = data.upperEntityContributorRate ?? 0;
    this.contributor = data.contributor || new Contributor({});
    this.product = data.product || new Product({});
    this.managementEntity = data.managementEntity || '';
  }
}
