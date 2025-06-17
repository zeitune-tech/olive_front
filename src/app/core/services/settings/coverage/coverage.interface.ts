import { Product } from "@core/services/settings/product/product.interface";
import { CoverageReference } from "../coverage-reference/coverage-reference.interface";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";

export class Coverage {
    id: string;
    nature: string;
    isFree: boolean;
    isFixed: boolean;
    calculationMode: string;
    fixedCapital: number;
    minCapital: number;
    maxCapital: number;
    order: number;
    prorata: string;
    displayPrime: boolean;
    generatesCharacteristic: boolean;
    reference: CoverageReference;
    product: Product;
    managementEntity: ManagementEntity;
  
    constructor(coverage: any) {
      this.id = coverage.id || '';
      this.nature = coverage.nature || '';
      this.isFree = coverage.isFree ?? false;
      this.isFixed = coverage.isFixed ?? false;
      this.calculationMode = coverage.calculationMode || '';
      this.fixedCapital = coverage.fixedCapital ?? 0;
      this.minCapital = coverage.minCapital ?? 0;
      this.maxCapital = coverage.maxCapital ?? 0;
      this.order = coverage.order ?? 0;
      this.prorata = coverage.prorata || '';
      this.displayPrime = coverage.displayPrime ?? false;
      this.generatesCharacteristic = coverage.generatesCharacteristic ?? false;
      this.reference = new CoverageReference(coverage.reference || {});
      this.product = coverage.product || '';
      this.managementEntity = coverage.managementEntity || '';
    }
  }
  