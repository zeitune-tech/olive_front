import { Contributor, ContributorType } from "@core/services/administration/contributor/contributor.interface";
import { Coverage } from "../coverage/coverage.interface";
import { Product } from "../product/product.interface";

export class CommissionContributor {
	id: string; // UUID sous forme de string
	dateEffective: string;
	commissionBase: string;
	calculationBase: string;
	managementRate: number | null;
	contributionRate: number | null;
	contributorId: string;
	product: Product;
	coverage: Coverage;
	contributor: Contributor;
	contributorType: ContributorType;

	constructor(data: Partial<CommissionContributor> = {}) {
		this.id = data.id || '';
		this.dateEffective = data.dateEffective || '';
		this.commissionBase = data.commissionBase || 'ACCESSORY';
		this.calculationBase = data.calculationBase || 'ACCESSORY';
		this.managementRate = data.managementRate || null;
		this.contributionRate = data.contributionRate || null;
		this.contributorId = data.contributorId || '';
		this.product = data.product || new Product({});
		this.coverage = data.coverage || new Coverage({});
		this.contributor = data.contributor || new Contributor({});
		this.contributorType = data.contributorType || new ContributorType({});
	}
}
