import { Component, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
import { ChangeLogoDialogComponent } from "../change-logo-dialog/change-logo-dialog.component";
import { RestrictionService } from "@core/services/restriction/restriction.service";
import { Restriction } from "@core/services/restriction/restriction.interface";

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


    availableModules: Module[] = [];

    formGroup!: UntypedFormGroup;
    logo: FormData | null = null;

    currentModule: Module | null = null;
    currentModuleFeatures: Feature[] = [];
    isModuleSelectorOpen = false;

    restrictions: Restriction[] = [];
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
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _dialog: MatDialog,
        private _restrictionService: RestrictionService,
    ) { }

    ngOnInit(): void {
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
            this.entity = user.managementEntity;
        });

        this._restrictionService.restrictions$.subscribe((restrictions: Restriction[]) => {
            this.restrictions = restrictions;
        });

        if (this.availableModules.length > 0) {
            this.selectModule(this.availableModules[0]);
        }

        this.formGroup = this._formBuilder.group({
            logo: [null],
        });

        this.formGroup.get("logo")?.valueChanges.subscribe((logo: FormData) => {
            this.logo = logo;
        });
    }

    openChangeLogoDialog() {
        const dialogRef = this._dialog.open(ChangeLogoDialogComponent, {
            data: { logo: this.logo },
        });

        dialogRef.afterClosed().subscribe((result: FormData) => {
            if (result) {
                this.logo = result;
                // Handle the logo change logic here
            }
        });
    }
}