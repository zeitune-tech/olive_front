import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {SelectionService} from '../../services/selection.service';
import {Branch} from '@core/services/settings/branch/branch.interface';
import {Product} from '@core/services/settings/product/product.interface';
import {Coverage} from '@core/services/settings/coverage/coverage.interface';
import {MatDialog} from '@angular/material/dialog';
import {SelectDialogComponent} from '@shared/components/select-dialog/select-dialog.component';
import {BranchService} from '@core/services/settings/branch/branch.service';
import {ProductService} from '@core/services/settings/product/product.service';
import {CoverageService} from '@core/services/settings/coverage/coverage.service';
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";

export type SelectionType = 'branch' | 'product' | 'pricingType' | 'coverage';

@Component({
  selector: 'pricing-selection-header',
  templateUrl: './pricing-selection-header.component.html'
})
export class PricingSelectionHeaderComponent implements OnInit, OnDestroy {
  @Input() selectionTypes: SelectionType[] = ['branch', 'product', 'pricingType'];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  selectedBranch?: Branch;
  selectedProduct?: Product;
  selectedPricingType?: PricingType;

  branches: Branch[] = [];
  products: Product[] = [];
  coverages: Coverage[] = [];
  pricingTypes: PricingType[] = [];

  constructor(
    private _selectionService: SelectionService,
    private _branchService: BranchService,
    private _productService: ProductService,
    private _pricingTypeService: PricingTypeService,
    private _coverageService: CoverageService,
    private _dialog: MatDialog
  ) {
  }

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
          this._pricingTypeService.getByProduct(product.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(pricingTypes => {
              this.pricingTypes = pricingTypes || [];
            });
        }
      });

    this._selectionService.selectedPricingType$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(pricingType => {
        this.selectedPricingType = pricingType;
        if (pricingType) {
          // this._coverageService.getByPricingType(pricingType.id)
          //   .pipe(takeUntil(this._unsubscribeAll))
          //   .subscribe(coverages => {
          //     this.coverages = coverages || [];
          //   });
        }
      });


  }

  // retrieve all selections form local storage

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
        this._selectionService.clearAllExcept(['branch']);
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
        this._selectionService.clearAllExcept(['branch', 'product']);
      }
    });
  }

  openPricingTypeSelection(): void {
    this._dialog.open(SelectDialogComponent, {
      width: '700px',
      data: {
        displayField: "name",
        items: this.pricingTypes,
        title: "pricing-type-selection.title"
      }
    }).afterClosed().subscribe((pricingType: PricingType) => {
      if (pricingType) {
        this._selectionService.setPricingType(pricingType);
        this._selectionService.clearAllExcept(['branch', 'product', 'pricingType']);
      }
    });
  }

  clearBranchSelection(): void {
    this._selectionService.clearSelections();
  }
}
