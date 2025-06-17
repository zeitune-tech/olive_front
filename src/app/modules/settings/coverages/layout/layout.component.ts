import { ChangeDetectorRef, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SelectProductComponent } from "../select-product/select-product.component";
import { Product } from "@core/services/settings/product/product.interface";
import { UntypedFormControl } from "@angular/forms";
import { LayoutService } from "../layout.service";


@Component({
    selector: "app-users-layout",
    templateUrl: "./layout.component.html",
})
export class CoverageLayoutComponent {

    
    selectedProduct: Product = {} as Product;
    products: Product[] = [];
    searchCtrl: UntypedFormControl = new UntypedFormControl('');

    constructor(
        private _layoutService: LayoutService,
        private _matDialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) { 
        this._layoutService.selectedProduct$.subscribe({
            next: (product: Product) => {
                this.selectedProduct = product;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    openEntitySelection() {
        const dialogRef = this._matDialog.open(SelectProductComponent, {
            data: {
                selected: this.selectedProduct,
            },
            width: '600px'
        });

        dialogRef.afterClosed().subscribe((entity: Product) => {
            if (entity) {
                this.selectedProduct = entity;
            }
        });
    }

    ngOnInit(): void {
        // Initialization logic here
    }
}