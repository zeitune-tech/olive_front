import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SelectionService } from '../../services/selection.service';
import { Branch } from '@core/services/settings/branch/branch.interface';
import { Product } from '@core/services/settings/product/product.interface';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { MatDialog } from '@angular/material/dialog';
import { SelectDialogComponent } from '@shared/components/select-dialog/select-dialog.component';
import { BranchService } from '@core/services/settings/branch/branch.service';
import { ProductService } from '@core/services/settings/product/product.service';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';

@Component({
    selector: 'pricing-selection-header',
    templateUrl: './pricing-selection-header.component.html'
})
export class PricingSelectionHeaderComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    selectedBranch?: Branch;
    selectedProduct?: Product;
    selectedCoverage?: Coverage;

    branches: Branch[] = [];
    products: Product[] = [];
    coverages: Coverage[] = [];

    constructor(
        private _selectionService: SelectionService,
        private _branchService: BranchService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Charger les branches
        this._branchService.branches$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(branches => {
                this.branches = branches;
            });

        // S'abonner aux changements de sélection
        this._selectionService.selectedBranch$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(branch => {
                this.selectedBranch = branch;
                if (branch) {
                    this._productService.getByBranchOrAll(branch.id)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(products => {
                            this.products = products || [];
                        });
                }
            });

        this._selectionService.selectedProduct$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {
                this.selectedProduct = product;
                if (product) {
                    this._coverageService.getByProduct(product.id)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(coverages => {
                            this.coverages = coverages || [];
                        });
                }
            });

        this._selectionService.selectedCoverage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(coverage => {
                this.selectedCoverage = coverage;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    openBranchSelection(): void {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                displayField: "name",
                items: this.branches,
                title: "branch-selection.title"
            }
        }).afterClosed().subscribe((branch: Branch) => {
            if (branch) {
                this._selectionService.setBranch(branch);
            }
        });
    }

    openProductSelection(): void {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                displayField: "name",
                items: this.products,
                title: "product-selection.title"
            }
        }).afterClosed().subscribe((product: Product) => {
            if (product) {
                this._selectionService.setProduct(product);
            }
        });
    }

    openCoverageSelection(): void {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                displayField: "nature",
                items: this.coverages,
                title: "coverage-selection.title"
            }
        }).afterClosed().subscribe((coverage: Coverage) => {
            if (coverage) {
                this._selectionService.setCoverage(coverage);
            }
        });
    }

    clearBranchSelection(): void {
        this._selectionService.clearSelections();
    }
}
