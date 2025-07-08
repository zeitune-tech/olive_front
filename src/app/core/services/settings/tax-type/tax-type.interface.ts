export enum TaxNature {
  VAT_PREMIUMS = 'VAT_PREMIUMS',
  VAT_ACCESSORIES = 'VAT_ACCESSORIES',
  FGA = 'FGA',
  BROWN_CARD = 'BROWN_CARD',
  OTHER = 'OTHER'
}


export interface TaxType {
  id: string;
  name: string;
  nature: TaxNature;
}