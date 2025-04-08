import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { RequestMetadata } from "@core/services/common.interface";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { LayoutService } from "../layout.service";

@Component({
    selector: "app-select-product",
    templateUrl: "./select-product.component.html",
})
export class SelectProductComponent {

    // Search
    searchControl: FormControl = new FormControl('');
    filteredEntity: Product[] = [];

    products: Product[] = [];
    metadata: RequestMetadata = {} as RequestMetadata;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { selected: Product },
        private _matDialogRef: MatDialogRef<SelectProductComponent>,
        private _productService: LayoutService
    ) {

        this._productService.products$.subscribe((products) => {
            this.products = products;
            this.filteredEntity = products;
        })

        this._productService.productMetadata$.subscribe((metadata) => {
            this.metadata = metadata;
        })

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
