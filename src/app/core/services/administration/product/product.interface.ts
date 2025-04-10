import { Branch, Category } from "../branch/branch.interface";

export class Product {
    id: string;
    name: string;
    branch: Branch;
    category: Category;
    visibility: string;
    ownerId: string;
    owner: string;
    minRisk: number;
    maxRisk: number;
    minimumGuaranteeNumber: number;
    fleet: boolean;
    hasReduction: boolean;

    constructor(response: Partial<Product>) {
        this.id = response?.id ?? '';
        this.name = response?.name ?? '';
        this.branch = response?.branch ?? new Branch(response?.branch ?? {});
        this.category = this.branch?.category ?? new Category(this.branch?.category ?? {});
        this.visibility = response?.visibility ?? 'PRIVATE';
        this.ownerId = response?.ownerId ?? '';
        this.owner = response?.owner ?? '';
        this.minRisk = response?.minRisk ?? 1;
        this.maxRisk = response?.maxRisk ?? 1;
        this.minimumGuaranteeNumber = response?.minimumGuaranteeNumber ?? 1;
        this.fleet = response?.fleet ?? false;
        this.hasReduction = response?.hasReduction ?? false;
    }
}
