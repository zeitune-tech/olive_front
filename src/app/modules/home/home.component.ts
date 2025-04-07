import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Module, ModuleService } from "@core/navigation/module.service";
import { NavigationService } from "@core/navigation/navigation.service";
import { PermissionsService } from "@core/permissions/permissions.service";
import { User } from "@core/services/auth/user/user.interface";
import { UserService } from "@core/services/auth/user/user.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";


@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent {


    modules: Module[] = [];
    user: User;

    constructor(
        private _userService: UserService,
        private _layoutService: LayoutService,
        private _navigationService: NavigationService,
        private _moduleService: ModuleService,
        private _router: Router
    ) {
        this.user = this._userService.user;
        this._userService.user$.subscribe((user) => {
            this.user = user;
        });

        this.modules = this._moduleService.getModules();
    }

    navigate(item: Module): void {
        if (item.enabled === false) {
            return;
        }
        localStorage.setItem("module", item.name);
        const nav =  this._navigationService.getNavigation(item.name);
        this._navigationService.currentNavigation = nav;
        this._layoutService.setNavigation(nav)
        this._moduleService.module = item;
        this._router.navigate(["/dashboard"]);
    }
}