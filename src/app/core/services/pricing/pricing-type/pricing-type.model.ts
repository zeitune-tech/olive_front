export class PricingType {
  id: string;
  name: string;
  description: string;
  product: string;
  branch: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity?.id ?? '';
    this.name = entity?.name ?? '';
    this.description = entity?.description ?? '';
    this.product = entity?.product ?? '';
    this.branch = entity?.branch ?? '';
    this.createdAt = entity?.createdAt ? new Date(entity.createdAt) : new Date();
    this.updatedAt = entity?.updatedAt ? new Date(entity.updatedAt) : new Date();
  }
}
