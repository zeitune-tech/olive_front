import { Injectable } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PermissionsService } from "@core/permissions/permissions.service";
import { Observable, ReplaySubject } from "rxjs";

export interface Module {
    name: string,
    title: string,
    description?: string,
    icon: string,
    cssClass?: string,
    route: string,
    permissions: string[],
    features: Feature[],
    enabled?: boolean,
}

export interface Feature {
    name: string,
    title: string,
    description?: string,
    icon: string,
    cssClass?: string,
    route: string,
    permissions: string[],
}

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    private activeCssClass = "card w-72 flex-1 flex flex-col items-center cursor-pointer shadow-md overflow-hidden rounded-md hover:bg-gray-200";
    private disabledCssClass = "bg-gray-300 rounded-md text-gray-500 cursor-not-allowed w-72 flex-1 flex flex-col items-center shadow-md overflow-hidden";
    
    private modules: Module[] = [
        {
            name: "administration",
            title: "modules.administration.title",
            description: "modules.administration.description",
            icon: "assets/images/modules/admin_icon.png",
            route: "/administration",
            permissions: [
                PERMISSIONS.VIEW_PRODUCTS,
                PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS,
                PERMISSIONS.VIEW_COMPANIES,
                PERMISSIONS.VIEW_POINTS_OF_SALE,
                PERMISSIONS.VIEW_USERS
            ],
            features: [
                {
                    name: "products",
                    title: "modules.administration.features.products",
                    description: "modules.administration.features.products_description",
                    icon: "production_quantity_limits",
                    route: "/administration/products",
                    permissions: [
                        PERMISSIONS.VIEW_PRODUCTS,
                    ]
                },
                {
                    name: "market_level_organizations",
                    title: "modules.administration.features.market_level_organizations",
                    description: "modules.administration.features.market_level_organizations_description",
                    icon: "business",
                    route: "/administration/market-level-organizations",
                    permissions: [
                        PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS,
                    ]
                },
                {
                    name: "companies",
                    title: "modules.administration.features.companies",
                    description: "modules.administration.features.companies_description",
                    icon: "business_center",
                    route: "/administration/companies",
                    permissions: [
                        PERMISSIONS.VIEW_COMPANIES,
                    ]
                },
                {
                    name: "points_of_sale",
                    title: "modules.administration.features.points_of_sale",
                    description: "modules.administration.features.points_of_sale_description",
                    icon: "storefront",
                    route: "/administration/points-of-sale",
                    permissions: [
                        PERMISSIONS.VIEW_POINTS_OF_SALE,
                    ]
                },
                {
                    name: "profiles",
                    title: "modules.administration.features.profiles",
                    description: "modules.administration.features.profiles_description",
                    icon: "manage_accounts",
                    route: "/administration/profiles",
                    permissions: [
                        PERMISSIONS.VIEW_USERS,
                    ]
                },
                {
                    name: "users",
                    title: "modules.administration.features.users",
                    description: "modules.administration.features.users_description",
                    icon: "people_alt",
                    route: "/administration/users",
                    permissions: [
                        PERMISSIONS.VIEW_USERS,
                    ]
                }
            ]
        },
        {
            name: "settings",
            title: "modules.settings.title",
            description: "modules.settings.description",
            icon: "assets/images/modules/param_icon.png",
            route: "/parameters",
            permissions: [
                PERMISSIONS.VIEW_COVERAGES,
            ],
            features: [
                {
                    name: "coverages",
                    title: "modules.settings.features.coverages",
                    description: "modules.settings.features.coverages_description",
                    icon: "settings",
                    route: "/parameters/coverages",
                    permissions: [
                        PERMISSIONS.VIEW_COVERAGES,
                    ]
                },
                {
                    name: "coverage_durations",
                    title: "modules.settings.features.coverage_durations",
                    description: "modules.settings.features.coverage_durations_description",
                    icon: "settings",
                    route: "/parameters/coverage-durations",
                    permissions: [
                        PERMISSIONS.VIEW_COVERAGE_DURATIONS,
                    ]
                },
                {
                    name: "insured_registries",
                    title: "modules.settings.features.insured_registries",
                    description: "modules.settings.features.insured_registries_description",
                    icon: "settings",
                    route: "/parameters/insured-registries",
                    permissions: [
                        PERMISSIONS.VIEW_INSURED_REGISTRIES,
                    ]
                },
                {
                    name: "production_registries",
                    title: "modules.settings.features.production_registries",
                    description: "modules.settings.features.production_registries_description",
                    icon: "settings",
                    route: "/parameters/production-registries",
                    permissions: [
                        PERMISSIONS.VIEW_PRODUCTION_REGISTRIES,
                    ]
                },
                {
                    name: "closures",
                    title: "modules.settings.features.closures",
                    description: "modules.settings.features.closures_description",
                    icon: "settings",
                    route: "/parameters/closures",
                    permissions: [
                        PERMISSIONS.VIEW_CLOSURES,
                    ]
                }
            ]
        },
        {
            name: "insureds",
            title: "modules.insureds.title",
            description: "modules.insureds.description",
            icon: "assets/images/modules/insureds.png",
            route: "/insured",
            permissions: [
                
            ],
            features: []
        },
        {
            name: "productions",
            title: "modules.productions_auto",
            icon: "assets/images/modules/exp_icon.png",
            route: "/production",
            permissions: [],
            features: []
        },
        {
            name: "attestations",
            title: "modules.attestations.title",
            description: "modules.attestations.description",
            icon: "assets/images/modules/attestations.png",
            route: "/production",
            permissions: [
                PERMISSIONS.VIEW_ATTESTATIONS,
                
            ],
            features: [
                {
                    name: "attestations",
                    title: "modules.attestations.features.attestations",
                    description: "modules.attestations.features.attestations_description",
                    icon: "production_quantity_limits",
                    route: "/attestations",
                    permissions: [
                        PERMISSIONS.VIEW_ATTESTATIONS,
                    ]
                },
                {
                    name: "attestations_demands",
                    title: "modules.attestations.features.attestations_demands",
                    description: "modules.attestations.features.attestations_demands_description",
                    icon: "production_quantity_limits",
                    route: "/attestations-demands",
                    permissions: [
                        PERMISSIONS.VIEW_ATTESTATIONS_DEMANDS,
                    ]
                },
                {
                    name: "market_level_organization",
                    title: "modules.attestations.features.market_level_organization",
                    description: "modules.attestations.features.market_level_organization_description",
                    icon: "production_quantity_limits",
                    route: "/attestations/market-level-organization",
                    permissions: [
                        PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_MARKET_LEVEL_ORGANIZATION,
                    ]
                },
                {
                    name: "companies",
                    title: "modules.attestations.features.companies",
                    description: "modules.attestations.features.companies_demands_description",
                    icon: "production_quantity_limits",
                    route: "/attestations/companies-demands",
                    permissions: [
                        PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_COMPANY,
                    ]
                }
            ]
        }
    ];

    private _module: ReplaySubject<Module> = new ReplaySubject<Module>(1);

    get module$(): Observable<Module> {
        return this._module.asObservable();
    }

    set module(value: Module) {
        this._module.next(value);
    }
    
    constructor(
        private _permissionsService: PermissionsService,
    ) { 

        this.modules.forEach((module: Module) => {
            module.cssClass = this.disabledCssClass;
            let canAccess = false;
            module.permissions.forEach(permission => {
                canAccess = this._permissionsService.hasPermission(permission)
            })
            if (canAccess) {
                module.cssClass = this.activeCssClass;
            }
            module.enabled = canAccess;
        })

        let moduleName = localStorage.getItem("module");
        if (!moduleName) {
            moduleName = this.modules[0].name;
        }
        const module = this.modules.find(module => module.name === moduleName) || this.modules[0];
        this._module.next(module);
    }


    getModules () : Module[] {
        return this.modules;
    }

    getCurrentModule () : Module {
        const moduleName = localStorage.getItem("module");
        return this.modules.find(module => module.name === moduleName) || this.modules[0];
    }

}