import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent {

    activeCssClass = "card w-72 flex-1 flex flex-col items-center cursor-pointer shadow-md overflow-hidden rounded-md hover:bg-gray-200";
    disabledCssClass = "bg-gray-500";

    modules = [
        {
            title: "home.modules.administration",
            icon: "admin_panel_settings",
            cssClass: this.activeCssClass,
            route: "/administration"
        },
        {
            title: "home.modules.parameters_auto",
            icon: "settings",
            cssClass: this.activeCssClass,
            route: "/parameters"
        },
        {
            title: "home.modules.insureds",
            icon: "insurance",
            route: "/insured",
            cssClass: this.activeCssClass
        },
        {
            title: "home.modules.productions_auto",
            icon: "production_quantity_limits",
            route: "/production",
            cssClass: this.activeCssClass
        },
    ];

    user: User;

    constructor(
        private _userService: UserService,
        private _router: Router
    ) {
        this.user = this._userService.user;
        this._userService.user$.subscribe((user) => {
            this.user = user;
        });
    }

    navigate(route: string): void {
        this._router.navigate([route]);
    }
}