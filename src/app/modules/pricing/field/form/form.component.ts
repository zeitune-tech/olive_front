import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import {Field} from "@core/services/pricing/field/field.interface";
import {FieldService} from "@core/services/pricing/field/field.service";
import {SelectFieldOptions} from "@core/services/pricing/field/select-field-options.interface";
import {SelectFieldOptionsService} from "@core/services/pricing/field/select-field-options.service";

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class FieldFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
      managementEntity: ManagementEntity | undefined;
      type: "NUMBER" | "SELECT" = "NUMBER"; // Default type, can be changed based on the field type
      types = [
            { value: 'NUMBER', label: 'Champ numérique' },
            { value: 'SELECT', label: 'Champ de sélection' }
      ];
      selectFieldOptions: SelectFieldOptions[] = []
      coverages: Coverage[] = [
            // This will be populated with the list of coverages from the CoverageService
            new Coverage({
                id: '1',
                nature: 'Health',
                name: 'Health Coverage'
            })
      ];

      mode: 'create' | 'edit' = 'create';

      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<FieldFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: Field,
          private _constantService: FieldService,
          private _coverageService: CoverageService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar,
          private _selectFieldOptionsService: SelectFieldOptionsService,
          private _managementEntityService: ManagementEntityService
      ) {}


  ngOnInit(): void {

    // Charger les couvertures
    this._coverageService.coverages$.subscribe(coverages => {
        this.coverages = coverages;
    });

    // Charger les options de champ de sélection si le type est SELECT
    if (this.isSelectField()) {
        this._selectFieldOptionsService.selectFieldOptionsList$.subscribe(options => {
            this.selectFieldOptions = options;
        });
    }

      // if (this.data) {
      //     this.mode = 'edit';
      //     this.dialogRef.updateSize('600px', 'auto');
      // } else {
      //     this.data = {} as Field;
      //     this.mode = 'create';
      //     this.dialogRef.updateSize('600px', 'auto');
      // }

    this._managementEntityService.entity$.subscribe((entity) => {
        this.managementEntity = entity;
    });

    this.formGroup = this.fb.group({
        label: [this.data.label || '', Validators.required],
        description: [this.data.description || '', Validators.required],
        variableName: [this.data.variableName || '', Validators.required],
        toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
        coverage: [this.data.coverage || '', Validators.required],
        options: [this.data.options || '', Validators.required],
        type: [this.data.type || 'NUMBER', Validators.required],
    });

    this.formGroup.get('type')?.valueChanges.subscribe((newType: "NUMBER" | "SELECT") => {
    this.type = newType;
    });

  }

  isSelectField = () => this.type === 'SELECT';

  onSubmit(): void {
      if (this.formGroup.invalid) return;

      this.formGroup.disable();

      const formData = {
          ...this.formGroup.value,
          managementEntity: this.managementEntity?.id,
          product: this.data.product,
      };

      console.log("Submitting form data:", formData);

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

    onCancel(): void {
        this.dialogRef.close(false);
    }
  }
