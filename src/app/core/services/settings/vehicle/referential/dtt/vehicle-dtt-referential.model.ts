import {VehicleModel} from "@core/services/settings/vehicle/referential/model/vehicle-model.model";

export class VehicleDTTReferential {
  id: string;
  name: string;
  model: VehicleModel;
  registrationNumber: string

  constructor(entity: any) {
    this.id = entity.id;
    this.name = entity.name;
    this.model = entity.model;
    this.registrationNumber = entity.registrationNumber;
  }
}
