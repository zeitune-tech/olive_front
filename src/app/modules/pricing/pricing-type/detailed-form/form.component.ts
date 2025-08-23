import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslocoService} from '@jsverse/transloco';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constant} from '@core/services/pricing/constant/constant.model';
import {ConstantService} from '@core/services/pricing/constant/constant.service';
import {ManagementEntityService} from '@core/services/administration/management-entity/management-entity.service';
import {ManagementEntity} from '@core/services/administration/management-entity/management-entity.interface';
import {Cons, forkJoin, Subject, takeUntil} from 'rxjs';
import {FormMode} from '@shared/enum/form.enum';
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {PricingTypeDetailed} from "@core/services/pricing/pricing-type/pricing-type-detailed.model";
import {Formula} from "@core/services/pricing/formula/formula.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {ProductService} from "@core/services/settings/product/product.service";

@Component({
  selector: 'app-pricing-type-edit',
  templateUrl: './form.component.html'
})
export class PricingTypeDetailedFormComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;
  branchName = '';
  productName = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PricingTypeDetailedFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PricingTypeDetailed,
    private _pricingTypeService: PricingTypeService,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private coverageService: CoverageService,
    private productService: ProductService,
    private branchService: BranchService,
  ) {
  }

  ngOnInit(): void {

    forkJoin([
      this.coverageService.getAll(),
      this.productService.getAll(),
      this.branchService.getAll(),
      this._pricingTypeService.getDetailedById(this.data.id)
    ],)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(([coverages, products, branches, detailedType]) => {
        this.data = detailedType;
        this.data.coverages = this.data.coverages
          .map(coverageItem => {
            coverageItem.id = coverages.find(c => c.id === coverageItem.id)?.reference.designation || '';
            return coverageItem;
          })
        this.branchName = branches.find(b => b.id === this.data.branch)?.name || '';
        this.productName = products.find(p => p.id === this.data.product)?.name || '';
      });

    this.mode = (this.data as any).mode;
    this.dialogRef.updateSize('1000px', 'auto');

    this._managementEntityService.entity$.subscribe((entity) => {
      this.managementEntity = entity;
    });

    this.formGroup = this.fb.group({
      name: [this.data.name || '', Validators.required],
      description: [this.data.description || '', Validators.required],
      branch: [this.data.branch || '', Validators.required],
      product: [this.data.product || '', Validators.required],
      coverages: [this.data.coverages || '', Validators.required],
    });

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  protected readonly Formula = Formula;
}
