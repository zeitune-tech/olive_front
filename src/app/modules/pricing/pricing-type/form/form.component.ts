import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from '@core/services/pricing/constant/constant.interface';
import { ConstantService } from '@core/services/pricing/constant/constant.service';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { Cons } from 'rxjs';
import { FormMode } from '@shared/enum/form.enum';
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";

@Component({
  selector: 'app-pricing-type-edit',
  templateUrl: './form.component.html'
})
export class PricingTypeFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PricingTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PricingType,
    private _pricingTypeService: PricingTypeService,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService
  ) {}

  ngOnInit(): void {

    this.mode = (this.data as any).mode;
    if (this.mode == FormMode.EDIT) {
      this.dialogRef.updateSize('600px', 'auto');
    } else {
      // this.data = {} as Constant;
      this.dialogRef.updateSize('600px', 'auto');
    }

    this._managementEntityService.entity$.subscribe((entity) => {
      this.managementEntity = entity;
    });

    this.formGroup = this.fb.group({
      name: [this.data.name || '', Validators.required],
      description: [this.data.description || '', Validators.required],
    });

  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      console.log('Form invalide:', this.formGroup.value);
      return;
    }

    this.formGroup.disable();

    const formData = {
      ...this.formGroup.getRawValue(), // Utiliser getRawValue() au lieu de value pour obtenir les valeurs même si le form est disabled
      product: this.data.product,
      branch: this.data.branch,
    };

    console.log("Submitting form data:", formData);

    (this.mode === FormMode.EDIT ? this._pricingTypeService.update(formData, this.data.id) : this._pricingTypeService.create(formData))
      .subscribe({
        next: () => {
          const successMessage = this.mode === FormMode.EDIT
            ? 'form.success.update'
            : 'form.success.creation';

          this.snackBar.open(
            this.translocoService.translate(successMessage),
            undefined,
            { duration: 3000, panelClass: 'snackbar-success' }
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open(
            this.translocoService.translate('form.errors.submission'),
            undefined,
            { duration: 3000, panelClass: 'snackbar-error' }
          );
          this.formGroup.enable();
        }
      });

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
