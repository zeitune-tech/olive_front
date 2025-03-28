import { Component, OnInit } from "@angular/core";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";

interface Module {
    id: string;
    name: string;
    features: Feature[];
}

interface Feature {
    name: string;
    description: string;
    icon: string;
}


@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {

    entity: ManagementEntity = {} as ManagementEntity;
    user: User = {} as User;


    availableModules: Module[] = [{
        id: 'gestion-client',
        name: 'Gestion Clients',
        features: [
            {
                name: 'Liste Clients',
                description: 'Visualiser et gérer la liste des clients',
                icon: 'fas fa-users'
            },
            {
                name: 'Ajouter Client',
                description: 'Créer un nouveau client',
                icon: 'fas fa-user-plus'
            },
            // Autres fonctionnalités...
        ]
    },
    {
        id: 'facturation',
        name: 'Facturation',
        features: [
            {
                name: 'Créer Facture',
                description: 'Générer une nouvelle facture',
                icon: 'fas fa-file-invoice-dollar'
            },
            {
                name: 'Liste Factures',
                description: 'Consulter les factures existantes',
                icon: 'fas fa-list'
            },
            // Autres fonctionnalités...
        ]
    }];

    currentModule: Module | null = null;
    currentModuleFeatures: Feature[] = [];
    isModuleSelectorOpen = false;
    openModuleSelector() {
        this.isModuleSelectorOpen = true;
    }

    closeModuleSelector() {
        this.isModuleSelectorOpen = false;
    }

    selectModule(module: Module) {
        this.currentModule = module;
        this.currentModuleFeatures = module.features;
        this.closeModuleSelector();
    }

    constructor(
        private _userService: UserService
    ) { }

    ngOnInit(): void {
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
            this.entity = user.managementEntity;
        });
        if (this.availableModules.length > 0) {
            this.selectModule(this.availableModules[0]);
        }
    }
}