import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ModuleService, Module } from "@core/navigation/module.service";
import { NavigationService } from "@core/navigation/navigation.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";


@Component({
    selector: 'select-module-dialog',
    templateUrl: './select-module-dialog.component.html',
})
export class SelectModuleDialogComponent {

    modules: Module[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SelectModuleDialogComponent>,
        private _layoutService: LayoutService,
        private _navigationService: NavigationService,
        private _moduleService: ModuleService,
        private _router: Router
    ) { 
        this.modules = this._moduleService.getModules();
    }
    

    selectModule(item: Module) {
        if (item.enabled === false) {
            return;
        }
        localStorage.setItem("module", item.name);
        const nav =  this._navigationService.getNavigation(item.name);
        this._navigationService.currentNavigation = nav;
        this._layoutService.setNavigation(nav)
        this._moduleService.module = item;
        this._router.navigate(["/dashboard"]);
        this.dialogRef.close();
    }
}