import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { InitialDataResolver } from './app.resolver';
import { PermissionsGuard } from './core/permissions/permissions.guard';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { DashboardResolver } from './modules/dashboard/dashboard.resolver';
import { InsuredsResolver } from './modules/insureds/insureds.resolver';
import { EmployeesResolver } from './modules/employees/employees.resolver';
import { AttestationsResolver } from './modules/attestations/attestations.resolver';
import { PointsOfSaleResolver } from './modules/points-of-sale/points-of-sale.resolver';
import { DemandsResolver } from './modules/demands/demands.resolver';
import { CompaniesResolver } from './modules/companies/companies.resolver';
import { EntitiesSuperiorResolver } from './modules/entities-superior/entities-superior.resolver';

const routerConfig: ExtraOptions = {
  preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};


const routes: Routes = [
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
    
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'signed-up-redirect', pathMatch: 'full', redirectTo: 'dashboard'},

    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadComponent: () => import('./modules/auth/sign-out/sign-out.component').then(m => m.AuthSignOutComponent)},
            {path: 'reset-password', loadComponent: () => import('./modules/auth/reset-password/reset-password.component').then(m => m.AuthResetPasswordComponent)},
        ]
    },
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {
                path: 'dashboard', 
                canActivate: [],
                canActivateChild: [],
                data: { 
                    permission: "USER"
                }, 
                resolve: {
                    data: DashboardResolver
                },
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'entities-superior',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    data: EntitiesSuperiorResolver
                },
                loadChildren: () => import('./modules/entities-superior/entities-superior.module').then(m => m.EntitiesSuperiorModule)
            },
            {
                path: 'companies',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    CompaniesResolver
                },
                loadChildren: () => import('./modules/companies/companies.module').then(m => m.CompaniesModule)
            },
            {
                path: 'demands',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    DemandsResolver
                },
                loadChildren: () => import('./modules/demands/demands.module').then(m => m.DemandsModule)
            },
            {
                path: 'points-of-sale',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    data: PointsOfSaleResolver
                },
                loadChildren: () => import('./modules/points-of-sale/points-of-sale.module').then(m => m.PointsOfSaleModule)
            },
            {
                path: 'attestations',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    data: AttestationsResolver
                },
                loadChildren: () => import('./modules/attestations/attestations.module').then(m => m.AttestationsModule)
            },
            {
                path: 'employees',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    data: EmployeesResolver
                },
                loadChildren: () => import('./modules/employees/employees.module').then(m => m.EmployeesModule)
            },
            {
                path: 'insureds',
                canActivate: [],
                canActivateChild: [],
                data: {
                    permission: PERMISSIONS.USER
                },
                resolve: {
                    data: InsuredsResolver
                },
                loadChildren: () => import('./modules/insureds/insureds.module').then(m => m.InsuredsModule)
            },
            
            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule), data: {layout: "empty"}},
            {path: '**', redirectTo: '404-not-found'},
        ]
    },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
