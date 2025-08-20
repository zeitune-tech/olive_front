import { TariffableAttribut } from './tariffable-attribut.model';

export class TariffableObject {
  attributs: TariffableAttribut[];
  name: string;

  constructor(entity: Partial<TariffableObject> = {}) {
    Object.assign(this, entity);
    this.name = entity.name || '';
    this.attributs = entity.attributs?.map(attr => new TariffableAttribut(attr)) || [];
  }
}
