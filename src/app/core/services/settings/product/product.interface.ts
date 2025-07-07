import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { Branch, Category } from "@core/services/settings/branch/branch.interface";
import { ProductionRegistry } from "../production-registry/production-registry.interface";

export class Product {
    id: string;
    name: string;
    description: string;
    branch: Branch;
    category: Category;
    visibility: string;
    owner: ManagementEntity;
    minRisk: number;
    maxRisk: number;
    minimumGuaranteeNumber: number;
    fleet: boolean;
    hasReduction: boolean;
    sharedWith: string[];
    productionRegistry: ProductionRegistry | null;

    constructor(response: any) {
        this.id = response?.id ?? '';
        this.name = response?.name ?? '';
        this.description = response?.description ?? '--';
        this.branch = response?.branch ?? new Branch(response?.branch ?? {});
        this.category = this.branch?.category ?? new Category(this.branch?.category ?? {});
        this.visibility = response?.visibility ?? 'PRIVATE';
        this.owner = response?.owner ?? new ManagementEntity(response?.owner ?? {});
        this.minRisk = response?.minRisk ?? 1;
        this.maxRisk = response?.maxRisk ?? 1;
        this.minimumGuaranteeNumber = response?.minimumGuaranteeNumber ?? 1;
        this.fleet = response?.fleet ?? false;
        this.hasReduction = response?.hasReduction ?? false;
        this.sharedWith = response?.sharedWith ?? [];
        this.productionRegistry = response?.productionRegistry ? new ProductionRegistry(response.productionRegistry) : null;
    }
}
