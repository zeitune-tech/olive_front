import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Product } from "@core/services/administration/product/product.interface";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
    selector: "app-select-product",
    templateUrl: "./select-product.component.html",
})
export class SelectProductComponent {

    // Search
    searchControl: FormControl = new FormControl('');
    filteredEntity: Product[] = [];

    products: Product[] = [];
    selected: Product | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { selected: Product, products: Product[] },
        private _matDialogRef: MatDialogRef<SelectProductComponent>
    ) {

        // Initialize products
        this.products = data.products || [];
        this.filteredEntity = this.products;
        this.selected = data.selected || null;

        // Set up search with debounce
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.searchEntity(value);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    openEntityCreationDialog(): void {
        this._matDialogRef.close('create');
    }
    /**
     * Select entity
     *
     * @param entity Selected entity
     */
    selectEntity(entity: Product): void {
        this._matDialogRef.close(entity);
    }

    /**
     * Search entities
     */
    private searchEntity(value: string): void {
        if (!value) {
            this.filteredEntity = this.products;
            return;
        }

        const searchValue = value.toLowerCase();
        this.filteredEntity = this.products.filter((product) => {
            return product.name.toLowerCase().includes(searchValue) || product.name.toLowerCase().includes(searchValue);
        });
    }

    /**
     * Track by function for ngFor loops
     */
    trackByFn(index: number, item: Product): any {
        return item.id;
    }
}
