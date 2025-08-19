import {Routes} from "@angular/router";
import {PERMISSIONS} from "@core/permissions/permissions.data";

export const routes: Routes = [
  {
    path: 'products',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_PRODUCTS
    },
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'coverages',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_PRODUCTS
    },
    loadChildren: () => import('./coverages/coverages.module').then(m => m.CoveragesModule)
  },
  {
    path: 'coverage-durations',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS
    },
    loadChildren: () => import('./coverage-durations/coverage-durations.module').then(m => m.CoverageDurationsModule)
  },
  {
    path: 'production-registries',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES
    },
    loadChildren: () => import('./production-registries/production-registries.module').then(m => m.ProductionRegistriesModule)
  },
  {
    path: 'insured-registries',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_INSURED_REGISTRIES
    },
    loadChildren: () => import('./insured-registries/insured-registries.module').then(m => m.InsuredRegistriesModule)
  },
  {
    path: 'closures',
    canActivate: [],
    canActivateChild: [],
    data: {
      permission: PERMISSIONS.VIEW_CLOSURES
    },
    loadChildren: () => import('./closures/closures.module').then(m => m.ClosuresModule)
  },
  {
    path: 'taxes',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_TAXES
    },
    loadChildren: () => import('./taxes/taxes.module').then(m => m.TaxesModule)
  },
  {
    path: 'accessories',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_ACCESSORIES
    },
    loadChildren: () => import('./accessories/accessories.module').then(m => m.AccessoriesModule)
  },
  {
    path: 'endorsements',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_ENDORSEMENTS
    },
    loadChildren: () => import('./endorsements/endorsments.module').then(m => m.EndorsementsModule)
  },
  {
    path: 'commissions',
    canActivate: [],
    canActivateChild: [],
    data: {
      // permission: PERMISSIONS.VIEW_COMMISSIONS
    },
    loadChildren: () => import('./commissions/commissions.module').then(m => m.CommissionsModule)
  },
  {
    path: 'duration-rates',
    canActivate: [],
    canActivateChild: [],
    data: {},
    loadChildren: () => import('./taux-duration/duration-rate.module').then(m => m.DurationRateModule)
  },
  {
    path: 'vehicle',
    canActivate: [],
    canActivateChild: [],
    data: {},
    loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule)
  }
];
