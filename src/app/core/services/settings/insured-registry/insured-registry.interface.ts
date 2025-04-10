export class InsuredRegistry {
    name: string;
    description: string;
    category: string;
    branch: string;
    prefix: string;
    length: number;
    managementEntity: string;
    counter: number;
  
    constructor(insuredRegistry: any) {
      this.name = insuredRegistry.name || '';
      this.description = insuredRegistry.description || '';
      this.category = insuredRegistry.category || '';
      this.branch = insuredRegistry.branch || '';
      this.prefix = insuredRegistry.prefix || '';
      this.length = insuredRegistry.length || 0;
      this.managementEntity = insuredRegistry.managementEntity || '';
      this.counter = insuredRegistry.counter || 0;
    }
  }
  