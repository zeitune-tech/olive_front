import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from '@core/services/pricing/constant/constant.model';
import { ConstantService } from '@core/services/pricing/constant/constant.service';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import {Cons, Subject, takeUntil} from 'rxjs';
import { FormMode } from '@shared/enum/form.enum';
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import moment from "moment";

@Component({
  selector: 'app-coverage-reference-edit',
  templateUrl: './form.component.html'
})
export class ConstantFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConstantFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Constant,
    private _constantService: ConstantService,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private _coverageService: CoverageService,
  ) {}

  coverages: Coverage[] = [];

  ngOnInit(): void {

    // Récupérer les couvertures
    this._coverageService.getByProduct(this.data.product)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((coverages: Coverage[]) => {
        this.coverages = coverages || [];
        console.log("Coverages loaded:", this.coverages);
      });

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

    if (this.mode === FormMode.CREATE) {
      this.formGroup = this.fb.group({
        coverage: [this.data.coverage || '', Validators.required],
        label: [this.data.label || '', Validators.required],
        description: [this.data.description || '', Validators.required],
        variableName: [{value: this.data.variableName || '', disabled: true}, Validators.required],
        toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
        branch: [this.data.branch || '', Validators.required],
        value: [this.data.value || '', Validators.required],
      });

    }else {
      this.formGroup = this.fb.group({
        coverage: [{value: this.data.coverage || '', disabled: true}, Validators.required],
        label: [this.data.label || '', Validators.required],
        description: [this.data.description || '', Validators.required],
        variableName: [{value: this.data.variableName || '', disabled: true}, Validators.required],
        toReturn: [this.data.toReturn !== undefined ? this.data.toReturn : false, Validators.required],
        branch: [this.data.branch || '', Validators.required],
        value: [this.data.value || '', Validators.required],
      });

    }


    // Surveiller les changements de valeur du champ label
    this.formGroup.get('label')?.valueChanges.subscribe(value => {
      if (!value) return;

      const variableName = value
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const descriptionPrefix = `Une constante de tarification (${variableName}) pour`;
      const description = `${descriptionPrefix} ${(this.formGroup.get('description')?.value as string).replace(/Une constante de tarification \([^\)]+\) pour /g, "")}`;

      // Utiliser patchValue au lieu de setValue pour mettre à jour plusieurs champs
      this.formGroup.patchValue({
        variableName: variableName,
        description: description
      });

      // Marquer les champs comme touchés pour déclencher la validation
      this.formGroup.get('variableName')?.markAsTouched();
      this.formGroup.get('description')?.markAsTouched();
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
      branch: this.data.branch,
      product: this.data.product,
      pricingType: this.data.pricingType,
    };

    console.log("Submitting form data:", formData);

    (this.mode === FormMode.EDIT ? this._constantService.update(formData, this.data.id) : this._constantService.create(formData))
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
