import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { SelectField } from '@core/services/pricing/field/field.interface';
import {SelectFieldOptions} from "@core/services/pricing/field/select-field-options/select-field-options.interface";
import {FieldService} from "@core/services/pricing/field/field.service";
import {SelectFieldOptionsService} from "@core/services/pricing/field/select-field-options/select-field-options.service";

@Component({
    selector: 'app-select-form',
    templateUrl: './form.component.html',
})
export class SelectFieldFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;
      options:SelectFieldOptions[] = []

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<SelectFieldFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: SelectField,
          private _fieldService: FieldService,
          private _selectFieldOptionsService: SelectFieldOptionsService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {

      this._selectFieldOptionsService.getAll().subscribe();

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

        this._selectFieldOptionsService.selectFieldOptionsList$.subscribe((options) => {this.options = options;});

        this.formGroup = this.fb.group({
              label: [this.data.label || '', Validators.required],
              description: [this.data.description || '', Validators.required],
              variableName: [this.data.variableName || '', Validators.required],
              toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
              options: [this.data.options || [], Validators.required],
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.value,
            managementEntity: this.managementEntity!.id,
            product: this.data.product,
            branch: this.data.branch,
            type: 'SELECT',
        };

        console.log("Submitting form data:", formData);

        this._fieldService.create(formData).subscribe({
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
