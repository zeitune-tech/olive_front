import {FieldType} from "@core/services/pricing/field/field.interface";

export class AttributOption {
  value: string;
  label: string;
  isActive: boolean;

  constructor(entity: Partial<AttributOption> = {}) {
    Object.assign(this, entity);
    this.value = entity.value || '';
    this.label = entity.label || '';
    this.isActive = entity.isActive ?? true; // Par défaut actif
  }
}


export class TariffableAttribut {
  controlName: string;
  label: string;
  type: FieldType;
  options: AttributOption[];

  constructor(entity: Partial<TariffableAttribut> = {}) {
    Object.assign(this, entity);
    this.controlName = entity.controlName || '';
    this.label = entity.label || '';
    this.type = entity.type ?? FieldType.NUMBER; // Valeur par défaut si nécessaire
    this.options = entity.options?.map(opt => new AttributOption(opt)) || [];
  }
}
