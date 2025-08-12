import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import {FieldType, NumericField} from '@core/services/pricing/field/field.interface';
import {FieldService} from "@core/services/pricing/field/field.service";
import { FormMode } from '@shared/enum/form.enum';



@Component({
    selector: 'app-numeric-form',
    templateUrl: './form.component.html'
})
export class NumericFieldFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;
      mode: FormMode = FormMode.CREATE;

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<NumericFieldFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: NumericField,
          private _fieldService: FieldService,
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
              label: [this.data.label || '', Validators.required],
              description: [this.data.description || '', Validators.required],
              variableName: [{ value: this.data.variableName || '', disabled: true }, Validators.required],
              toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
        });

        // Surveiller les changements de valeur du champ label
        this.formGroup.get('label')?.valueChanges.subscribe(value => {
            if (!value) return;

            const variableName = value
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');

            const descriptionPrefix = `Un champ numérique (${variableName}) pour`;
            const description = `${descriptionPrefix} ${(this.formGroup.get('description')?.value as string || '').replace(/Un champ numérique \([^\)]+\) pour /g, '')}`;

            this.formGroup.patchValue({
                variableName: variableName,
                description: description
            });

            this.formGroup.get('variableName')?.markAsTouched();
            this.formGroup.get('description')?.markAsTouched();
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.getRawValue(), // Utiliser getRawValue() au lieu de value
            product: this.data.product,
            branch: this.data.branch,
            type: FieldType.NUMBER, // Assuming this is a numeric field

        };

        ((this.mode as FormMode) === FormMode.EDIT ? this._fieldService.update(formData, this.data.id) : this._fieldService.create(formData)).subscribe({
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
