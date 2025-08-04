import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import { Cons } from 'rxjs';
import {SelectFieldOptions} from "@core/services/pricing/field/select-field-options/select-field-options.interface";
import {SelectFieldOptionsService} from "@core/services/pricing/field/select-field-options/select-field-options.service";
import { SelectFieldOptionValue } from '@core/services/pricing/field/select-field-option-value/select-field-option-value.interface';
import { SelectFieldOptionValueService } from '@core/services/pricing/field/select-field-option-value/select-field-option-value.service';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class SelectFieldOptionsFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;
      possibilities: SelectFieldOptionValue[] = [];

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<SelectFieldOptionsFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: SelectFieldOptions,
          private _selectFieldOptionsService: SelectFieldOptionsService,
          private _selectFieldOptionValueService: SelectFieldOptionValueService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _managementEntityService: ManagementEntityService
      ) {}

    ngOnInit(): void {

        this._selectFieldOptionValueService.getAll().subscribe();

        this._selectFieldOptionValueService.selectFieldOptionValues$.subscribe((values) => {
            this.possibilities = values;
        });

        this.mode = (this.data as any).mode;
        if (this.mode == 'edit') {
            this.dialogRef.updateSize('600px', 'auto');
        } else {
            // this.data = {} as SelectFieldOptions;
            this.dialogRef.updateSize('600px', 'auto');
        }

        this._managementEntityService.entity$.subscribe((entity) => {
            this.managementEntity = entity;
        });


        this.formGroup = this.fb.group({
              label: [this.data.label || '', Validators.required],
              name: [this.data.name || '', Validators.required],
              description: [this.data.description || '', Validators.required],
              possibilities: [this.data.possibilities || '', Validators.required],
              // value: [this.data.value || '', Validators.required],
        });

    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.value,
            managementEntity: this.managementEntity!.id,
            branch: (this.data as any)!.branch,
        };

        console.log("Submitting form data:", formData);

        this._selectFieldOptionsService.create(formData).subscribe({
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
