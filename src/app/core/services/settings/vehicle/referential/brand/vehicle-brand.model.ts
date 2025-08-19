import {VehicleModel} from "@core/services/settings/vehicle/referential/model/vehicle-model.model";

export class VehicleBrand {
  id: string;
  name: string;
  models: VehicleModel[];

  constructor(entity: any) {
    this.id = entity.id;
    this.name = entity.name;
    this.models = entity.models ? entity.models.map((model: any) => new VehicleModel(model)) : [];
  }
}
