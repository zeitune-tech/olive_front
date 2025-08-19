import {Product} from "@core/services/settings/product/product.interface";
import {VehicleUsage} from "@core/services/settings/vehicle/usage/usage.model";

export class VehicleCategory {

  id: string;
  name: string;
  withTrailer: boolean;
  withChassis: boolean;
  products: Product[];
  usages: VehicleUsage[];

  constructor(id: string, name: string, withTrailer: boolean, withChassis: boolean, products: Product[], usages: VehicleUsage[]) {
    this.id = id;
    this.name = name;
    this.withTrailer = withTrailer;
    this.withChassis = withChassis;
    this.products = products;
    this.usages = usages;
  }
}
