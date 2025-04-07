import { Component, OnInit } from "@angular/core";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { User } from "@core/services/auth/user/user.interface";
import { UserService } from "@core/services/auth/user/user.service";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { Module, ModuleService } from "@core/navigation/module.service";


@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {

    entity: ManagementEntity = {} as ManagementEntity;
    user: User = {} as User;

    module: Module = {} as Module;

    constructor(
        private _userService: UserService,
        private _managementEntityService: ManagementEntityService,
        private _moduleService: ModuleService,
    ) { }

    ngOnInit(): void {
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });

        this._managementEntityService.entity$.subscribe((entity: ManagementEntity) => {
            this.entity = entity;
        });

        this._moduleService.module$.subscribe((module: Module) => {
            this.module = module;
        });
    }
}