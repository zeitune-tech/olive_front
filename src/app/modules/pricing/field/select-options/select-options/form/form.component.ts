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

        this._selectFieldOptionValueService.selectFieldOptionValues$
          .subscribe((values) => {
            this.possibilities = values;
            // Réinitialiser le champ possibilities après avoir reçu les données
            if (this.formGroup && this.mode === 'edit') {
                this.initializePossibilities();
            }
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

        // Initialiser le formulaire avec les valeurs par défaut
        this.formGroup = this.fb.group({
              label: [this.data.label || '', Validators.required],
              name: [{value: this.data.name || '', disabled: true}, Validators.required],
              description: [this.data.description || '', Validators.required],
              possibilities: [[], Validators.required], // Initialiser avec un tableau vide
              // value: [this.data.value || '', Validators.required],
        });

      // Surveiller les changements de valeur du champ label
      this.formGroup.get('label')?.valueChanges.subscribe(value => {
        if (!value) return;

        const name = value
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

        const descriptionPrefix = `Une liste d'options (${name}) pour`;
        const description = `${descriptionPrefix} ${(this.formGroup.get('description')?.value as string).replace(/Une liste d'options \([^\)]+\) pour /g, "")}`;

        // Utiliser patchValue au lieu de setValue pour mettre à jour plusieurs champs
        this.formGroup.patchValue({
          name: name,
          description: description
        });

        // Marquer les champs comme touchés pour déclencher la validation
        this.formGroup.get('variableName')?.markAsTouched();
        this.formGroup.get('description')?.markAsTouched();
      });

    }

    /**
     * Initialise les possibilités sélectionnées pour le mode édition
     */
    private initializePossibilities(): void {
        if (this.data.possibilities && this.mode === 'edit') {
            let selectedIds: string[] = [];

            // Si this.data.possibilities est un tableau d'objets SelectFieldOptionValue
            if (Array.isArray(this.data.possibilities)) {
                selectedIds = this.data.possibilities.map((item: SelectFieldOptionValue) => item.id);
            }

            // Mettre à jour le FormControl avec les IDs sélectionnés
            this.formGroup.patchValue({
                possibilities: selectedIds
            });
        }
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const formData = {
            ...this.formGroup.getRawValue(), // Utiliser getRawValue() pour obtenir les valeurs même si le form est disabled
            branch: (this.data as any)!.branch,
            product: (this.data as any)!.product,
        };

        // Ajouter l'ID pour le mode édition
        if (this.mode === 'edit') {
            formData['id'] = this.data.id;
        }

        console.log("Submitting form data:", formData);

        if (this.mode === 'edit') {
            this._selectFieldOptionsService.update(formData, this.data.id).subscribe({
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

        // TODO: Ajouter la méthode update au service SelectFieldOptionsService
        // Pour l'instant, on utilise create pour les deux modes
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
