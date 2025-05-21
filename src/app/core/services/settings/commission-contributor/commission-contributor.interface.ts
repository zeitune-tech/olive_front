export class CommissionContributor {
  id: string;
  dateEffective: string;
  commissionBase: string;
  contributorRate: number;
  upperEntityContributorRate: number;
  contributor: string;
  product: string;
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
