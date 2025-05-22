import { FuelType, GearboxType, VehicleUsage, VehicleType } from '@core/enums';
import { Insured } from '../insured/insured.interface';

export class Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  fuelType: FuelType;
  gearboxType: GearboxType;
  fiscalPower: number;
  realPower: number;
  seatingCapacity: number;
  firstRegistrationDate: string;
  initialValue: number;
  currentValue: number;
  vin: string;
  vehicleUsage: VehicleUsage;
  vehicleType: VehicleType;
  mileage: number;
  usualParkingLocation: string;
  insured: Insured;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.licensePlate = data.licensePlate || '';
    this.brand = data.brand || '';
    this.model = data.model || '';
    this.fuelType = data.fuelType || '';
    this.gearboxType = data.gearboxType || '';
    this.fiscalPower = data.fiscalPower ?? 0;
    this.realPower = data.realPower ?? 0;
    this.seatingCapacity = data.seatingCapacity ?? 0;
    this.firstRegistrationDate = data.firstRegistrationDate || '';
    this.initialValue = data.initialValue ?? 0;
    this.currentValue = data.currentValue ?? 0;
    this.vin = data.vin || '';
    this.vehicleUsage = data.vehicleUsage || '';
    this.vehicleType = data.vehicleType || '';
    this.mileage = data.mileage ?? 0;
    this.usualParkingLocation = data.usualParkingLocation || '';
    this.insured = data.insured || null;
    this.managementEntity = data.managementEntity || '';
  }
}
