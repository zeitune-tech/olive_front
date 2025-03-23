

export interface InsuranceLevel {
    id: string;
    name: string;
    description: string;
}

export class Category implements InsuranceLevel {
    id: string;
    name: string;
    description: string;

    constructor(category: Category) {
        this.id = category?.id;
        this.name = category?.name;
        this.description = category?.description;
    }
}

export class Branch implements InsuranceLevel {
    id: string;
    name: string;
    description: string;
    category: Category;

    constructor(branch: Branch) {
        this.id = branch?.id;
        this.name = branch?.name;
        this.description = branch?.description;
        this.category = branch?.category;
    }
}

export class Product implements InsuranceLevel {
    id: string;
    name: string;
    description: string;
    branch: Branch;
    category: Category;

    constructor(product: Product) {
        this.id = product?.id;
        this.name = product?.name;
        this.description = product?.description;
        this.branch = product?.branch;
        this.category = this.branch?.category;
    }
}