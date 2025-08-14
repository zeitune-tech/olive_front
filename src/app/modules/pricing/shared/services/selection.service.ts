import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Branch} from '@core/services/settings/branch/branch.interface';
import {Product} from '@core/services/settings/product/product.interface';
// import {Coverage} from '@core/services/settings/coverage/coverage.interface';
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";

export type SelectionType = 'branch' | 'product' | 'pricingType'; // | 'coverage';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private readonly STORAGE_KEYS = {
    BRANCH: 'selectedBranch',
    PRODUCT: 'selectedProduct',
    // COVERAGE: 'selectedCoverage',
    PRICING_TYPE: 'selectedPricingType'
  };

  private _selectedBranch = new BehaviorSubject<Branch | undefined>(undefined);
  private _selectedProduct = new BehaviorSubject<Product | undefined>(undefined);
  // private _selectedCoverage = new BehaviorSubject<Coverage | undefined>(undefined);
  private _selectedPricingType = new BehaviorSubject<PricingType | undefined>(undefined);

  constructor() {
    this.loadFromStorage();
  }

  // Observable streams
  readonly selectedBranch$ = this._selectedBranch.asObservable();
  readonly selectedProduct$ = this._selectedProduct.asObservable();
  // readonly selectedCoverage$ = this._selectedCoverage.asObservable();
  readonly selectedPricingType$ = this._selectedPricingType.asObservable();

  // Getters for current values
  get selectedBranch(): Branch | undefined {
    return this._selectedBranch.value;
  }

  get selectedProduct(): Product | undefined {
    return this._selectedProduct.value;
  }

  // get selectedCoverage(): Coverage | undefined {
  //   return this._selectedCoverage.value;
  // }

  get selectedPricingType(): PricingType | undefined {
    return this._selectedPricingType.value;
  }

  // Setters with storage update
  setBranch(branch: Branch | undefined): void {
    this._selectedBranch.next(branch);
    if (branch) {
      localStorage.setItem(this.STORAGE_KEYS.BRANCH, JSON.stringify(branch));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.BRANCH);
    }
  }

  setProduct(product: Product | undefined): void {
    this._selectedProduct.next(product);
    if (product) {
      localStorage.setItem(this.STORAGE_KEYS.PRODUCT, JSON.stringify(product));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.PRODUCT);
    }
  }

  // setCoverage(coverage: Coverage | undefined): void {
  //   this._selectedCoverage.next(coverage);
  //   if (coverage) {
  //     localStorage.setItem(this.STORAGE_KEYS.COVERAGE, JSON.stringify(coverage));
  //   } else {
  //     localStorage.removeItem(this.STORAGE_KEYS.COVERAGE);
  //   }
  // }

  setPricingType(pricingType: PricingType | undefined): void {
    this._selectedPricingType.next(pricingType);
    if (pricingType) {
      localStorage.setItem(this.STORAGE_KEYS.PRICING_TYPE, JSON.stringify(pricingType));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.PRICING_TYPE);
    }
  }

  // Clear all selections
  clearSelections(): void {
    this.setBranch(undefined);
    this.setProduct(undefined);
    // this.setCoverage(undefined);
    this.setPricingType(undefined);
  }

  // Clear all selections except for a specific list
  clearAllExcept(selectionsToKeep: SelectionType[]): void {
    if (!selectionsToKeep.includes('branch')) {
      this.setBranch(undefined);
    }
    if (!selectionsToKeep.includes('product')) {
      this.setProduct(undefined);
    }
    // if (!selectionsToKeep.includes('coverage')) {
    //   this.setCoverage(undefined);
    // }
    if (!selectionsToKeep.includes('pricingType')) {
      this.setPricingType(undefined);
    }
  }

  // Clear a specific selection
  clearSelection(selection: SelectionType): void {
    switch (selection) {
      case 'branch':
        this.setBranch(undefined);
        break;
      case 'product':
        this.setProduct(undefined);
        break;
      case 'pricingType':
        this.setPricingType(undefined);
        break;
      // case 'coverage':
      //   this.setCoverage(undefined);
      //   break;
      default:
        console.warn(`Unknown selection type: ${selection}`);
    }
  }

  // Check if all selections are made
  hasAllSelections(selections: SelectionType[]): {
    value: boolean,
    missing: SelectionType[]
  } {
    const missing = selections.filter(selection => {
      switch (selection) {
        case 'branch':
          return !this._selectedBranch.value;
        case 'product':
          return !this._selectedProduct.value;
        case 'pricingType':
          return !this._selectedPricingType.value;
        default:
          return false;
      }
    });
    return {
      value: missing.length === 0,
      missing
    };
  }

  private loadFromStorage(): void {
    try {
      const savedBranch = localStorage.getItem(this.STORAGE_KEYS.BRANCH);
      const savedProduct = localStorage.getItem(this.STORAGE_KEYS.PRODUCT);
      // const savedCoverage = localStorage.getItem(this.STORAGE_KEYS.COVERAGE);
      const savedPricingType = localStorage.getItem(this.STORAGE_KEYS.PRICING_TYPE);

      if (savedBranch) {
        this._selectedBranch.next(JSON.parse(savedBranch));
      }
      if (savedProduct) {
        this._selectedProduct.next(JSON.parse(savedProduct));
      }
      // if (savedCoverage) {
      //   this._selectedCoverage.next(JSON.parse(savedCoverage));
      // }
      if (savedPricingType) {
        this._selectedPricingType.next(JSON.parse(savedPricingType));
      }
    } catch (error) {
      console.error('Error loading selections from storage:', error);
      this.clearSelections();
    }
  }
}
