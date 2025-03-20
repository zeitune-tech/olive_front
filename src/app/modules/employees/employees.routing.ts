import { Routes } from "@angular/router";
import { EmployeesListComponent } from "./list/list.component";
import { EmployeesRoleComponent } from "./role/role.component";
import { EmployeesNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: EmployeesListComponent },
    { path: 'roles', component: EmployeesRoleComponent },
    { path: 'new', component: EmployeesNewComponent }
]
