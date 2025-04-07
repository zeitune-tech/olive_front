import { Component, OnDestroy, OnInit } from "@angular/core";
import { LayoutService } from "../../../../@lhacksrt/services/layout/layout.service";
import { AppNavigationService } from "../../../../@lhacksrt/components";
import { VerticalNavigationComponent } from "../../../../@lhacksrt/components/navigation/vertical/vertical.component";
import { ModuleService, Module } from "@core/navigation/module.service";
import { MatDialog } from "@angular/material/dialog";
import { SelectModuleDialogComponent } from "../select-module-dialog/select-module-dialog.component";


@Component({
    selector: 'header',
    templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy { 

    modules: Module[] = [];
    module: Module = {} as Module;

    constructor(
        private dialog: MatDialog,
        private _layoutService: LayoutService,
        private _moduleService: ModuleService,
        private _appNavigationService: AppNavigationService
    ) { 
        this.modules = this._moduleService.getModules();
        this._moduleService.module$.subscribe((module: Module) => {
            this.module = module;
        });
    }

    ngOnInit(): void { }

    ngOnDestroy(): void { }

    toggleNavigation(): void { 
        
        if ( this._layoutService.isScreenSmall ) {
            this.toggle('mainNavigation');
        } 

        else 
            this._layoutService.switchLayout()
    }

    private toggle(name: string): void {
        // Get the navigation
        const navigation = this._appNavigationService.getComponent<VerticalNavigationComponent>(name);

        if ( navigation ) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    openDialog() {
        this.dialog.open(SelectModuleDialogComponent, {
            panelClass: 'select-module-dialog',
            data: { modules: this.modules }
        });
    }
}