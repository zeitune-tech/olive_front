import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementEntityService } from '@core/services/administration/management-entity/management-entity.service';
import { ManagementEntity } from '@core/services/administration/management-entity/management-entity.interface';
import {Cons, Subject, takeUntil} from 'rxjs';
import { FormMode } from '@shared/enum/form.enum';
import {VehicleDTTReferential} from "@core/services/settings/vehicle/referential/dtt/vehicle-dtt-referential.model";
import {
  VehicleDTTReferentialService
} from "@core/services/settings/vehicle/referential/dtt/vehicle-dtt-referential.service";

@Component({
  selector: 'app-vehicle-usage-edit',
  templateUrl: './form.component.html'
})
export class VehicleDTTReferentialFormComponent implements OnInit {

  formGroup!: FormGroup;
  message = '';
  managementEntity: ManagementEntity | undefined;
  mode: FormMode = FormMode.CREATE;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleDTTReferentialFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleDTTReferential,
    private translocoService: TranslocoService,
    private snackBar: MatSnackBar,
    private _managementEntityService: ManagementEntityService,
    private _vehicleBrandService: VehicleDTTReferentialService,
  ) {}


  ngOnInit(): void {
    // Récupérer les couvertures
    this.mode = (this.data as any).mode;
    if (this.mode == FormMode.EDIT) {
      this.dialogRef.updateSize('600px', 'auto');
    } else {
      // this.data = {} as VehicleDTTReferential;
      this.dialogRef.updateSize('600px', 'auto');
    }

    this._managementEntityService.entity$.subscribe((entity) => {
      this.managementEntity = entity;
    });

    this.formGroup = this.fb.group({
      name: [this.data.name || '', Validators.required],
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

    (this.mode === FormMode.EDIT ? this._vehicleBrandService.update(formData, this.data.id) : this._vehicleBrandService.create(formData))
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
