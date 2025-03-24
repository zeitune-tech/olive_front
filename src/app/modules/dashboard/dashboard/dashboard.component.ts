import { Component, OnInit } from "@angular/core";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {

    entity: ManagementEntity = {} as ManagementEntity;
    user: User = {} as User;

    constructor(
        private _userService: UserService
    ) { }

    ngOnInit(): void {
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
            this.entity = user.managementEntity;
        });
    }

    

}