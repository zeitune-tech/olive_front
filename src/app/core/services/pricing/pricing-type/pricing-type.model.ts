export class PricingType {
  id: string;
  name: string;
  description: string;
  product: string;
  branch: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(response: Partial<PricingType> = {}) {
    Object.assign(this, response);
    this.id = response?.id ?? '';
    this.name = response?.name ?? '';
    this.description = response?.description ?? '';
    this.product = response?.product ?? '';
    this.branch = response?.branch ?? '';
    this.createdAt = response?.createdAt ? new Date(response.createdAt) : new Date();
    this.updatedAt = response?.updatedAt ? new Date(response.updatedAt) : new Date();
  }
}
