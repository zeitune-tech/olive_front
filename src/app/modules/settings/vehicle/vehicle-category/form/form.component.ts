import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import {Subject, takeUntil} from 'rxjs';
import { FormMode } from '@shared/enum/form.enum';
import {Product} from "@core/services/settings/product/product.interface";
import {ProductService} from "@core/services/settings/product/product.service";
import {VehicleCategory} from "@core/services/settings/vehicle/category/category.model";
import {VehicleCategoryService} from "@core/services/settings/vehicle/category/category.service";
import {VehicleUsageService} from "@core/services/settings/vehicle/usage/usage.service";
import {VehicleUsage} from "@core/services/settings/vehicle/usage/usage.model";

@Component({
  selector: 'app-coverage-reference-edit',
  templateUrl: './form.component.html'
})
export class VehicleCategoryFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleCategory,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private _vehicleCategoryService: VehicleCategoryService,
    private _vehicleUsageService: VehicleUsageService,
    private _productService: ProductService,
  ) {}

  usages: VehicleUsage[] = [];
  products: Product[] = [];

  /**
   * Initialise les usages sélectionnées pour le mode édition
   */
  initializeUsages(): void {
    if (this.data.usages && this.mode === 'edit') {
      let selectedIds: string[] = [];

      // Si this.data.usages est un tableau d'objets VehicleUsage
      if (Array.isArray(this.data.usages)) {
        selectedIds = this.data.usages.map((item: VehicleUsage) => item.id);
      }

      // Mettre à jour le FormControl avec les IDs sélectionnés
      this.formGroup.patchValue({
        usages: selectedIds
      });
    }
  }

  /**
   * Initialise les produits sélectionnés pour le mode édition
   */
  initializeProducts(): void {
    if (this.data.products && this.mode === 'edit') {
      let selectedIds: string[] = [];
      // Si this.data.products est un tableau d'objets Product
      if (Array.isArray(this.data.products)) {
        selectedIds = this.data.products.map((item: Product) => item.id);
      }
      // Mettre à jour le FormControl avec les IDs sélectionnés
      this.formGroup.patchValue({
        products: selectedIds
      });
    }
  }

  ngOnInit(): void {

    // Récupérer les produits
    this._productService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

    this._productService.products$
      .subscribe((values) => {
        this.products = values;
        // Réinitialiser le champ produits après avoir reçu les données
        if (this.formGroup && this.mode === 'edit') {
          this.initializeProducts();
        }
      });

    this._vehicleUsageService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

    this._vehicleUsageService.vehicleUsages$
      .subscribe((values) => {
        this.usages = values;
        // Réinitialiser le champ usages après avoir reçu les données
        if (this.formGroup && this.mode === 'edit') {
          this.initializeUsages();
        }
      });

    // Récupérer les couvertures
    this.mode = (this.data as any).mode;
    if (this.mode == FormMode.EDIT) {
      this.dialogRef.updateSize('600px', 'auto');
    } else {
      // this.data = {} as VehicleCategory;
      this.dialogRef.updateSize('600px', 'auto');
    }

    this._managementEntityService.entity$.subscribe((entity) => {
      this.managementEntity = entity;
    });

    this.formGroup = this.fb.group({
      name: [this.data.name || '', Validators.required],
      withTrailer: [this.data.withTrailer !== undefined ? this.data.withTrailer : false, Validators.required],
      withChassis: [this.data.withChassis !== undefined ? this.data.withChassis : false, Validators.required],
      products: [this.data.products || '', Validators.required],
      usages: [this.data.usages || '', Validators.required],
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
    };

    console.log("Submitting form data:", formData);

    (this.mode === FormMode.EDIT ? this._vehicleCategoryService.update(formData, this.data.id) : this._vehicleCategoryService.create(formData))
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
