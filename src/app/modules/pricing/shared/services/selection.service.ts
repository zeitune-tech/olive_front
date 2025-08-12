import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Branch } from '@core/services/settings/branch/branch.interface';
import { Product } from '@core/services/settings/product/product.interface';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';

@Injectable({
    providedIn: 'root'
})
export class SelectionService {
    private readonly STORAGE_KEYS = {
        BRANCH: 'selectedBranch',
        PRODUCT: 'selectedProduct',
        COVERAGE: 'selectedCoverage'
    };

    private _selectedBranch = new BehaviorSubject<Branch | undefined>(undefined);
    private _selectedProduct = new BehaviorSubject<Product | undefined>(undefined);
    private _selectedCoverage = new BehaviorSubject<Coverage | undefined>(undefined);

    constructor() {
        this.loadFromStorage();
    }

    // Observable streams
    readonly selectedBranch$ = this._selectedBranch.asObservable();
    readonly selectedProduct$ = this._selectedProduct.asObservable();
    readonly selectedCoverage$ = this._selectedCoverage.asObservable();

    // Getters for current values
    get selectedBranch(): Branch | undefined {
        return this._selectedBranch.value;
    }

    get selectedProduct(): Product | undefined {
        return this._selectedProduct.value;
    }

    get selectedCoverage(): Coverage | undefined {
        return this._selectedCoverage.value;
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

    setCoverage(coverage: Coverage | undefined): void {
        this._selectedCoverage.next(coverage);
        if (coverage) {
            localStorage.setItem(this.STORAGE_KEYS.COVERAGE, JSON.stringify(coverage));
        } else {
            localStorage.removeItem(this.STORAGE_KEYS.COVERAGE);
        }
    }

    // Clear all selections
    clearSelections(): void {
        this.setBranch(undefined);
        this.setProduct(undefined);
        this.setCoverage(undefined);
    }

    // Check if all selections are made
    hasAllSelections(selections: ('branch'|'product'|'coverage')[]): { value: boolean, missing: ('branch'|'product'|'coverage')[] } {
        const missing = selections.filter(selection => {
                   switch (selection) {
                       case 'branch': return !this._selectedBranch.value;
                       case 'product': return !this._selectedProduct.value;
                       case 'coverage': return !this._selectedCoverage.value;
                       default: return false;
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
            const savedCoverage = localStorage.getItem(this.STORAGE_KEYS.COVERAGE);

            if (savedBranch) {
                this._selectedBranch.next(JSON.parse(savedBranch));
            }
            if (savedProduct) {
                this._selectedProduct.next(JSON.parse(savedProduct));
            }
            if (savedCoverage) {
                this._selectedCoverage.next(JSON.parse(savedCoverage));
            }
        } catch (error) {
            console.error('Error loading selections from storage:', error);
            this.clearSelections();
        }
    }
}
