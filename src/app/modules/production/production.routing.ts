import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const routes: Routes = [
    {
        path: 'mono',
        canActivate: [],
        canActivateChild: [],
        data: {
            // permission: PERMISSIONS.VIEW_MONO
        },
        loadChildren: () => import('./mono/mono.module').then(m => m.MonoModule)
    }
];