import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslocoService} from '@jsverse/transloco';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constant} from '@core/services/pricing/constant/constant.model';
import {ConstantService} from '@core/services/pricing/constant/constant.service';
import {ManagementEntityService} from '@core/services/administration/management-entity/management-entity.service';
import {ManagementEntity} from '@core/services/administration/management-entity/management-entity.interface';
import {Cons} from 'rxjs';
import {FormMode} from '@shared/enum/form.enum';
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {PricingTypeDetailed} from "@core/services/pricing/pricing-type/pricing-type-detailed.model";

@Component({
  selector: 'app-pricing-type-edit',
  templateUrl: './form.component.html'
})
export class PricingTypeDetailedFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PricingTypeDetailedFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PricingTypeDetailed,
    private _pricingTypeService: PricingTypeService,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService
  ) {
  }

  ngOnInit(): void {

    this._pricingTypeService.getDetailedById(this.data.id)
      .subscribe((detailedType) => {
        this.data = detailedType;
        console.log('detailedType', detailedType);
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

  onSubmit(): void {

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
