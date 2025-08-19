/* eslint-disable */

import {NavigationItem} from "@lhacksrt/components";
import {PERMISSIONS} from "@core/permissions/permissions.data";

export const defaultSettingsNavigation: NavigationItem[] = [
  {
    id: 'products',
    title: 'sidebar.products.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    link: '/parameters/dashboard',
    permission: PERMISSIONS.VIEW_PRODUCTS,
    children: [
      {
        id: 'coverages.list-referiential',
        title: 'sidebar.coverages.referential',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/coverages/referentials',
        permission: PERMISSIONS.VIEW_COVERAGES
      },
      {
        id: 'products.list',
        title: 'sidebar.products.list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/products/list',
        permission: PERMISSIONS.VIEW_PRODUCTS
      },
      {
        id: 'coverages.list',
        title: 'sidebar.coverages.list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/coverages/list',
        permission: PERMISSIONS.VIEW_COVERAGES
      },
      {
        id: 'incompatible-coverages-list',
        title: 'sidebar.incompatible_coverages.list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/coverages/incompatibilities',
        permission: PERMISSIONS.VIEW_COVERAGES
      }
    ]
  },
  {
    id: 'coverage-durations',
    title: 'sidebar.coverage_durations.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS,
    children: [
      {
        id: 'coverage-durations.list',
        title: 'sidebar.coverage_durations.list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/coverage-durations/list',
        permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS
      },
      {
        id: 'duration-rates.list',
        title: 'sidebar.duration_rates.list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/parameters/duration-rates/list',
        // permission: PERMISSIONS.VIEW_DURATION_RATES
      }
    ]
  },
  {
    id: 'endorsements',
    title: 'sidebar.endorsement.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    // permission: PERMISSIONS.VIEW_ENDORSEMENTS,
    children: [
      {
        id: 'types-avenants',
        title: 'sidebar.endorsement.types',
        type: 'basic',
        icon: 'fluent:document-bullet-list-24-regular',
        link: '/parameters/endorsements/list',
        // permission: PERMISSIONS.VIEW_TYPES_AVENANTS
      },
      {
        id: 'succession-avenants',
        title: 'sidebar.endorsement.succession',
        type: 'basic',
        icon: 'fluent:document-sync-24-regular',
        link: '/parameters/succession-avenants',
        // permission: PERMISSIONS.VIEW_SUCCESSION_AVENANTS
      },
      {
        id: 'mode-fonctionnement-avenants',
        title: 'sidebar.endorsement.modeFonctionnement',
        type: 'basic',
        icon: 'fluent:settings-24-regular',
        link: '/parameters/mode-fonctionnement-avenants',
        // permission: PERMISSIONS.VIEW_MODE_FONCTIONNEMENT_AVENANTS
      },
      {
        id: 'ristourne',
        title: 'sidebar.endorsement.ristourne',
        type: 'basic',
        icon: 'fluent:money-hand-24-regular',
        link: '/parameters/ristourne',
        // permission: PERMISSIONS.VIEW_RISTOURNE
      },
      {
        id: 'motif-avenants-produit',
        title: 'sidebar.endorsement.motifAvenantsProduit',
        type: 'basic',
        icon: 'fluent:notepad-24-regular',
        link: '/parameters/motif-avenants-produit',
        // permission: PERMISSIONS.VIEW_MOTIF_AVENANTS_PRODUIT
      },
      {
        id: 'motif-annulation-produit',
        title: 'sidebar.endorsement.motifAnnulationProduit',
        type: 'basic',
        icon: 'fluent:delete-24-regular',
        link: '/parameters/motif-annulation-produit',
        // permission: PERMISSIONS.VIEW_MOTIF_ANNULATION_PRODUIT
      }
    ]
  },

  {
    id: 'accessories',
    title: 'sidebar.accessories.title',
    type: 'basic',
    icon: 'fluent:people-team',
    link: '/parameters/accessories/list',
    // permission: PERMISSIONS.VIEW_ACCESSORIES
  },
  {
    id: 'taxes',
    title: 'sidebar.taxes.title',
    type: 'collapsable',
    icon: 'fluent:money-hand-24-regular',
    // permission: PERMISSIONS.VIEW_TAXES,
    children: [
      {
        id: 'taxes.types',
        title: 'sidebar.taxes.types.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/taxes/taxes-type',
      },
      {
        id: 'taxes.primes',
        title: 'sidebar.taxes.primes.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/taxes/taxes-primes',

      },
      {
        id: 'taxes.accessoires',
        title: 'sidebar.taxes.accessoires.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/taxes/taxes-accessories',
      },
      {
        id: 'taxes.exoneration',
        title: 'sidebar.taxes.exoneration',
        type: 'basic',
        icon: 'fluent:shield-dismiss-24-regular',
        link: '/parameters/taxes/taxes-exemption',
        // permission: PERMISSIONS.VIEW_EXONERATION
      },
      {
        id: 'taxes.timbre-dimension',
        title: 'sidebar.taxes.timbreDimension',
        type: 'basic',
        icon: 'fluent:scale-24-regular',
        link: '/parameters/taxes/dimension-stamp',
        // permission: PERMISSIONS.VIEW_TIMBRE_DIMENSION
      },
      {
        id: 'taxes.timbre-gradue',
        title: 'sidebar.taxes.timbreGradue',
        type: 'basic',
        icon: 'fluent:scale-fill-24-regular',
        link: '/parameters/taxes/graduated-stamp',
        // permission: PERMISSIONS.VIEW_TIMBRE_GRADUE
      }
    ]
  },
  {
    id: 'commissions',
    title: 'sidebar.commissions.title',
    type: 'collapsable',
    icon: 'fluent:money-calculator-24-regular',
    // permission: PERMISSIONS.VIEW_COMMISSIONS,
    children: [
      {
        id: 'commissions.primes',
        title: 'sidebar.commissions.primes.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/primes',
      },
      {
        id: 'commissions.accessoires',
        title: 'sidebar.commissions.accessoires.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/accessories'
      },
      {
        id: 'commissions.apporteurs.primes',
        title: 'sidebar.commissions.apporteurs.primes.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/contributors-primes',
      },
      {
        id: 'commissions.apporteurs.accessoires',
        title: 'sidebar.commissions.apporteurs.accessoires.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/contributors-accessories',
      },
      {
        id: 'commissions.taxes',
        title: 'sidebar.commissions.taxes.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/taxes',
      },
      {
        id: 'commissions.apporteurs.taxes',
        title: 'sidebar.commissions.apporteurs.taxes.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/commissions/contributors-taxes',
      }
    ]
  },
  {
    id: 'vehicle',
    title: 'sidebar.vehicle.title',
    type: 'collapsable',
    icon: 'fluent:money-calculator-24-regular',
    // permission: PERMISSIONS.VIEW_COMMISSIONS,
    children: [
      {
        id: 'usage.list',
        title: 'sidebar.vehicle.vehicle-usage.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/vehicle/vehicle-usage',
      },
      {
        id: 'category.list',
        title: 'sidebar.vehicle.vehicle-category.title',
        type: 'basic',
        icon: 'fluent:list-24-regular',
        link: '/parameters/vehicle/vehicle-category',
      },
    ]
  }

];

export const compactSettingsNavigation: NavigationItem[] = [
  {
    id: 'coverages',
    title: 'sidebar.coverages.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    link: '/parameters/dashboard',
    permission: PERMISSIONS.VIEW_COVERAGES_REFERENCES,
    children: []
  },
  {
    id: 'coverage-durations',
    title: 'sidebar.coverage_durations.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS,
    children: []
  },
  {
    id: 'production_registries',
    title: 'sidebar.production_registries.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES,
    children: []
  },
  {
    id: 'insured_registries',
    title: 'sidebar.insured_registries.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    permission: PERMISSIONS.VIEW_INSURED_REGISTRIES,
    children: []
  }
];
