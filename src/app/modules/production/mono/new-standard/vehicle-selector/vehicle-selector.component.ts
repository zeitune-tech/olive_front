import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Vehicle } from '@core/services/insured/vehicle/vehicle.interface';
import { VehicleService } from '@core/services/insured/vehicle/vehicle.service';

@Component({
  selector: 'vehicle-selector',
  templateUrl: './vehicle-selector.component.html'
})
export class VehicleSelectorComponent implements OnInit {
  form!: UntypedFormGroup;

  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Input() insuredUuid!: string;

  vehicles: Vehicle[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      vehicleUuid: [null, Validators.required]
    });

    this._vehicleService.getAll().subscribe((list) => {
      this.vehicles = this.insuredUuid
        ? list.filter(v => v.insured?.id === this.insuredUuid)
        : list;
    });

    this.formReady.emit(this.form);
  }
}
