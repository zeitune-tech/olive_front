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

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class ConstantFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<ConstantFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: Constant,
          private _constantService: ConstantService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {

        this.mode = (this.data as any).mode;
        if (this.mode == 'edit') {
            this.dialogRef.updateSize('600px', 'auto');
        } else {
            // this.data = {} as Constant;
            this.dialogRef.updateSize('600px', 'auto');
        }

        this._managementEntityService.entity$.subscribe((entity) => {
            this.managementEntity = entity;
        });

        this.formGroup = this.fb.group({
              label: [this.data.label || '', Validators.required],
              description: [this.data.description || '', Validators.required],
              variableName: [this.data.variableName || '', Validators.required],
              toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
              branch: [this.data.branch || '', Validators.required],
              value: [this.data.value || '', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.value,
            managementEntity: this.managementEntity?.id,
            product: this.data.product,
        };

        console.log("Submitting form data:", formData);

        if (this.mode === 'edit') {
            this._constantService.update(formData, this.data.id).subscribe({
                next: () => {
                    const successMessage = this.mode === 'edit'
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
        } else {
            this._constantService.create(formData).subscribe({
                next: () => {
                    const successMessage = this.mode === 'edit'
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

        
    }

      onCancel(): void {
          this.dialogRef.close(false);
      }
  }
