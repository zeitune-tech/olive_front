import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { InitialDataResolver } from './app.resolver';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { DashboardResolver } from './modules/dashboard/dashboard.resolver';
import { PointsOfSaleResolver } from './modules/admin/points-of-sale/points-of-sale.resolver';
import { CompaniesResolver } from './modules/admin/companies/companies.resolver';
import { AdministrationResolver } from './modules/admin/admin.resolver';
import { resolve } from 'path';
import { SettingsResolver } from './modules/settings/settings.resolver';
import { AttestationsResolver } from './modules/attestations/attestations.resolver';
import { InsuredResolver } from './modules/insured/insured.resolver';
import { ProductionResolver } from './modules/production/production.resolver';

const routerConfig: ExtraOptions = {
  preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};


const routes: Routes = [
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home'},
    {path: 'signed-up-redirect', pathMatch: 'full', redirectTo: 'home'},

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
                path: 'home',
                canActivate: [],
                canActivateChild: [],
                data: {
                    layout: 'custom',
                },
                loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'dashboard',
                canActivate: [],
                canActivateChild: [],
                data: {},
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
            },
            {
                path: 'administration',
                resolve: {
                    administrationData: AdministrationResolver
                },
                canActivate: [],
                canActivateChild: [],
                data: {},
                loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'parameters',
                canActivate: [],
                canActivateChild: [],
                resolve: {
                    resolveData: SettingsResolver
                },
                data: {},
                loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
            },
            {
                path: 'attestations',
                canActivate: [],
                canActivateChild: [],
                data: {},
                resolve: {
                    AttestationsResolver
                },
                loadChildren: () => import('./modules/attestations/attestations.module').then(m => m.AttestationsModule)
            },
            {
                path: 'insured',
                canActivate: [],
                canActivateChild: [],
                data: {
                    // permission: PERMISSIONS.VIEW_INSUREDS
                },
                resolve: {
                    InsuredResolver
                },
                loadChildren: () => import('./modules/insured/insured.module').then(m => m.InsuredModule)
            },

            {
                path: 'production',
                canActivate: [],
                canActivateChild: [],
                data: {
                    // permission: PERMISSIONS.VIEW_PRODUCTION
                },
                resolve: {
                    ProductionResolver
                },
                loadChildren: () => import('./modules/production/production.module').then(m => m.ProductionModule)
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
