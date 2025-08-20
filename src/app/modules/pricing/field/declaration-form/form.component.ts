import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslocoService} from '@jsverse/transloco';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ManagementEntityService} from '@core/services/administration/management-entity/management-entity.service';
import {ManagementEntity} from '@core/services/administration/management-entity/management-entity.interface';
import {DeclarationField, Field, FieldType} from '@core/services/pricing/field/field.interface';
import {FieldService} from "@core/services/pricing/field/field.service";
import {FormMode} from '@shared/enum/form.enum';
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {Subject, takeUntil} from "rxjs";
import {TariffableObject} from "@core/services/pricing/tariffable-attribut/tariffable-object.model";
import {TariffableObjectService} from "@core/services/pricing/tariffable-attribut/tariffable-object.service";
import {TariffableAttribut} from "@core/services/pricing/tariffable-attribut/tariffable-attribut.model";
import {TypeOfVariable} from "@core/services/pricing/variable-item/variable-item.interface";

@Component({
  selector: 'app-declaration-form',
  templateUrl: './form.component.html'
})
export class DeclarationFieldFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;
  _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeclarationFieldFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeclarationField,
    private _fieldService: FieldService,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private _coverageService: CoverageService,
    private _tariffableObjectService: TariffableObjectService
  ) {
  }

  coverages: Coverage[] = [];
  tariffableObjects: TariffableObject[] = [];
  selectedTariffableObject?: TariffableObject;
  selectedTariffableAttribut?: TariffableAttribut;

  ngOnInit(): void {
    this._tariffableObjectService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

    this._tariffableObjectService.tariffableObjects$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tariffableObject) => {
        if (tariffableObject) {
          this.tariffableObjects = tariffableObject;
        }
      });

    // Récupérer les couvertures
    this._coverageService.getByProduct(this.data.product)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((coverages: Coverage[]) => {
        this.coverages = coverages || [];
      });

    this.mode = (this.data as any).mode;
    this.dialogRef.updateSize('600px', 'auto');
    this.formGroup = this.fb.group({
      coverage: [this.data.coverage || '', Validators.required],
      tariffableObjectName: [this.data.tariffableObjectName || '', Validators.required],
      tariffableAttribut: [this.data.tariffableAttribut || '', Validators.required],
    });

    this.formGroup.get('tariffableObjectName')?.valueChanges
      .subscribe(value => {
        this.selectedTariffableObject = this.tariffableObjects.find(obj => obj.name === value);
      });
    this.formGroup.get('tariffableAttribut')?.valueChanges.subscribe(value => {
      this.selectedTariffableAttribut = this.selectedTariffableObject?.attributs.find(attr => attr.controlName === value);
    })
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;
    this.formGroup.disable();
    const type = (this.selectedTariffableAttribut!.type as string) == "NUMBER" ? FieldType.NUMBER : FieldType.SELECT;
    switch (type) {
      case FieldType.NUMBER:
        const numericFormData:Field = {
          label: this.selectedTariffableAttribut!.label,
          description: this.selectedTariffableAttribut!.label,
          variableName: this.selectedTariffableAttribut!.controlName,
          toReturn: false,
          controlName: this.selectedTariffableAttribut!.controlName,
          product: this.data.product,
          branch: this.data.branch,
          coverage: this.formGroup.get('coverage')?.value,
          pricingType: this.data.pricingType,
          type: FieldType.NUMBER,
          typeOfVariable: TypeOfVariable.NUMERIC_FIELD,
        } as Field;
        ((this.mode as FormMode) === FormMode.EDIT ? this._fieldService.update(numericFormData, this.data.id) : this._fieldService.create(numericFormData)).subscribe({
          next: () => {
            const successMessage = this.mode === FormMode.EDIT
              ? 'form.success.update'
              : 'form.success.creation';

            this.snackBar.open(
              this.translocoService.translate(successMessage),
              undefined,
              {duration: 3000, panelClass: 'snackbar-success'}
            );
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open(
              this.translocoService.translate('form.errors.submission'),
              undefined,
              {duration: 3000, panelClass: 'snackbar-error'}
            );
            this.formGroup.enable();
          }
        });
        break;
      case FieldType.SELECT:
        const selectFormData:Field = {
          label: this.selectedTariffableAttribut!.label,
          description: this.selectedTariffableAttribut!.label,
          variableName: this.selectedTariffableAttribut!.controlName,
          toReturn: false,
          controlName: this.selectedTariffableAttribut!.controlName,
          product: this.data.product,
          branch: this.data.branch,
          coverage: this.formGroup.get('coverage')?.value,
          pricingType: this.data.pricingType,
          type: FieldType.SELECT,
          typeOfVariable: TypeOfVariable.NUMERIC_FIELD,
          options: null
        } as Field;
        ((this.mode as FormMode) === FormMode.EDIT ? this._fieldService.update(selectFormData, this.data.id) : this._fieldService.create(selectFormData)).subscribe({
          next: () => {
            const successMessage = this.mode === FormMode.EDIT
              ? 'form.success.update'
              : 'form.success.creation';

            this.snackBar.open(
              this.translocoService.translate(successMessage),
              undefined,
              {duration: 3000, panelClass: 'snackbar-success'}
            );
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open(
              this.translocoService.translate('form.errors.submission'),
              undefined,
              {duration: 3000, panelClass: 'snackbar-error'}
            );
            this.formGroup.enable();
          }
        });
        break;
    }

    const formData = {
      ...this.formGroup.getRawValue(), // Utiliser getRawValue() au lieu de value
      product: this.data.product,
      branch: this.data.branch,
      pricingType: this.data.pricingType,
      type: this.selectedTariffableAttribut!.type as FieldType,
    };


    console.log("Submitting form data:", formData);
    return;
    ((this.mode as FormMode) === FormMode.EDIT ? this._fieldService.update(formData, this.data.id) : this._fieldService.create(formData)).subscribe({
      next: () => {
        const successMessage = this.mode === FormMode.EDIT
          ? 'form.success.update'
          : 'form.success.creation';

        this.snackBar.open(
          this.translocoService.translate(successMessage),
          undefined,
          {duration: 3000, panelClass: 'snackbar-success'}
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open(
          this.translocoService.translate('form.errors.submission'),
          undefined,
          {duration: 3000, panelClass: 'snackbar-error'}
        );
        this.formGroup.enable();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
