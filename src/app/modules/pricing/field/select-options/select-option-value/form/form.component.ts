import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { Cons } from 'rxjs';
import {SelectFieldOptionValue} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.interface";
import {SelectFieldOptionValueService} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.service";

@Component({
    selector: 'app-princing-select-field-option-value-edit',
    templateUrl: './form.component.html'
})
export class SelectFieldOptionValueFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<SelectFieldOptionValueFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: SelectFieldOptionValue,
          private _selectFieldOptionValueService: SelectFieldOptionValueService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {

        this.mode = (this.data as any).mode;
        if (this.mode == 'edit') {
            this.dialogRef.updateSize('600px', 'auto');
        } else {
            // this.data = {} as SelectFieldOptionValue;
            this.dialogRef.updateSize('600px', 'auto');
        }

        this._managementEntityService.entity$.subscribe((entity) => {
            this.managementEntity = entity;
        });

        this.formGroup = this.fb.group({
              label: [this.data.label || '', Validators.required],
              name: [{value: this.data.name || '', disabled: true}, Validators.required],
              group: [this.data.group || 'DEFAULT', Validators.required],
        });

      // Surveiller les changements de valeur du champ label
      this.formGroup.get('label')?.valueChanges.subscribe(value => {
        if (!value) return;

        const variableName = value
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

        // Utiliser patchValue au lieu de setValue pour mettre à jour plusieurs champs
        this.formGroup.patchValue({
          name: variableName,
        });

        // Marquer les champs comme touchés pour déclencher la validation
        this.formGroup.get('name')?.markAsTouched();
      });

    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.getRawValue(), // Utiliser getRawValue() au lieu de value pour obtenir les valeurs même si le form est disabled
            branch: (this.data as any)?.branch  || '',
        };

        if (this.mode === 'edit') {
            formData['id'] = this.data.id; // Ensure the ID is included for updates
            this._selectFieldOptionValueService.update(this.data.id, formData).subscribe({
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
            return;
        }

        this._selectFieldOptionValueService.create(formData).subscribe({
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

      onCancel(): void {
          this.dialogRef.close(false);
      }
  }
