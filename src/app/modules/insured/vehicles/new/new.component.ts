import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FuelType,
  GearboxType,
  VehicleUsage,
  VehicleType
} from '@core/enums';
import { Insured } from '@core/services/insured/insured/insured.interface';
import { InsuredService } from '@core/services/insured/insured/insured.service';
import { VehicleService } from '@core/services/insured/vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle-new',
  templateUrl: './new.component.html'
})
export class VehicleNewComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  message = '';
  insureds: Insured[] = [];

  fuelTypes = Object.values(FuelType);
  gearboxTypes = Object.values(GearboxType);
  vehicleUsages = Object.values(VehicleUsage);
  vehicleTypes = Object.values(VehicleType);

  constructor(
    private _formBuilder: FormBuilder,
    private _vehicleService: VehicleService,
    private _insuredService: InsuredService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      licensePlate: [null, Validators.required],
      brand: [null, Validators.required],
      model: [null, Validators.required],
      fuelType: [null, Validators.required],
      gearboxType: [null, Validators.required],
      fiscalPower: [null, Validators.required],
      realPower: [null, Validators.required],
      seatingCapacity: [null, Validators.required],
      firstRegistrationDate: [null, Validators.required],
      initialValue: [null, Validators.required],
      currentValue: [null, Validators.required],
      vin: [null, Validators.required],
      vehicleUsage: [null, Validators.required],
      vehicleType: [null, Validators.required],
      mileage: [null, Validators.required],
      usualParkingLocation: [null, Validators.required],
      insuredId: [null, Validators.required]
    });

    this._insuredService.getAll().subscribe((insureds) => {
      this.insureds = insureds;
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this._vehicleService.create(data).subscribe(() => {
        this.message = 'form.success.created';
      });
    }
  }
}
