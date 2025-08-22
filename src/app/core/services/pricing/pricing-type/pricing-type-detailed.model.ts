import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {VariableItem} from "@core/services/pricing/variable-item/variable-item.model";
import {Formula} from "@core/services/pricing/formula/formula.interface";

export class CoverageItem {
  id: string;
  formulas: Formula[];
  variables: VariableItem[];

  constructor(response: Partial<CoverageItem> = {}) {
    Object.assign(this, response);
    this.id = response.id || '';
    this.formulas = response.formulas?.map(item => new Formula(item)) || [];
    this.variables = response.variables?.map(item => new VariableItem(item)) || [];
  }
}

export class PricingTypeDetailed extends PricingType {
  coverages: CoverageItem[];

  constructor(response: Partial<PricingTypeDetailed> = {}) {
    super(response);
    Object.assign(this, response);
    this.coverages = response.coverages?.map(item => new CoverageItem(item)) || [];
  }
}
