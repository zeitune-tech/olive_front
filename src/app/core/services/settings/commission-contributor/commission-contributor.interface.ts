import { Product } from "@core/services/administration/product/product.interface";

export class Contributor {
  id: string;
  name: string;
  code: string;
  type: string;
  logo: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.code = data.code || '';
    this.type = data.type || '';
    this.logo = data.logo || '';
  }
}

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
    this.contributor = data.contributor || '';
    this.product = data.product || '';
    this.managementEntity = data.managementEntity || '';
  }
}
