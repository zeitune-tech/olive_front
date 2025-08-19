export class VehicleModel {
  id: string;
  name: string;
  motorizationType: string;
  bodywork: string;
  placeCount: number;
  hasTurbo: boolean;
  horsepower: number;
  displacement: number; // cylindrée en litre
  weight: number; // poids en kilogramme
  nature: string;

  constructor(entity: any) {
    this.id = entity.id;
    this.name = entity.name;
    this.motorizationType = entity.motorizationType;
    this.bodywork = entity.bodywork;
    this.placeCount = entity.placeCount;
    this.hasTurbo = entity.hasTurbo;
    this.horsepower = entity.horsepower;
    this.displacement = entity.displacement;
    this.weight = entity.weight;
    this.nature = entity.nature;
  }

  static toString (model: VehicleModel): string {
    return `${model.name} (${model.motorizationType}, ${model.bodywork}, ${model.nature}, ${model.horsepower} chv, ${model.weight} kg)`;
  }
}
