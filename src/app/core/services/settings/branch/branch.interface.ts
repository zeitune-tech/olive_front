export class Branch {
    id: string;
    name: string;
    description: string;
    category: Category;

    constructor(response: Partial<Branch>) {
        this.id = response?.id ?? '';
        this.name = response?.name ?? '';
        this.description = response?.description ?? '';
        this.category = response?.category ? new Category(response.category) : new Category({});
    }
}

export class Category {
    id: string;
    name: string;
    description: string;

    constructor(response: Partial<Category>) {
        this.id = response?.id ?? '';
        this.name = response?.name ?? '';
        this.description = response?.description ?? '';
    }
}