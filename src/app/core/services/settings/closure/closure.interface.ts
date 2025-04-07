export class Closure {
    type: string;
    date: string;
    managementEntity: string;
    product: string;
  
    constructor(closure: any) {
      this.type = closure.type || '';
      this.date = closure.date || '';
      this.managementEntity = closure.managementEntity || '';
      this.product = closure.product || '';
    }
  }
  