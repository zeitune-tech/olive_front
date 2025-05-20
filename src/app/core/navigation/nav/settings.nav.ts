/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultSettingsNavigation: NavigationItem[] = [
    {
        id: 'coverages',
        title: 'sidebar.coverages.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COVERAGES,
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
            },
            {
                id: 'coverages-new',
                title: 'sidebar.coverages.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/new',
                permission: PERMISSIONS.CREATE_COVERAGES
            },
            {
                id: 'incompatible-coverages-new',
                title: 'sidebar.incompatible_coverages.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/new-incompatibility',
                permission: PERMISSIONS.CREATE_COVERAGES
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
                id: 'coverage-durations.new',
                title: 'sidebar.coverage_durations.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverage-durations/new',
                permission: PERMISSIONS.CREATE_COVERAGE_DURATIONS
            },

        ]
    },
    {
        id: 'duration-rates',
        title: 'sidebar.duration_rates.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        // permission: PERMISSIONS.VIEW_DURATION_RATES,
        children: [
            {
                id: 'duration-rates.list',
                title: 'sidebar.duration_rates.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/duration-rates/list',
                // permission: PERMISSIONS.VIEW_DURATION_RATES
            },
            {
                id: 'duration-rates.new',
                title: 'sidebar.duration_rates.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/duration-rates/new',
                // permission: PERMISSIONS.CREATE_DURATION_RATES
            }
        ]
    },
    {
        id: 'closures',
        title: 'sidebar.closures.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_CLOSURES,
        children: [
            {
                id: 'closures.list',
                title: 'sidebar.closures.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/closures/list',
                permission: PERMISSIONS.VIEW_CLOSURES
            },
            {
                id: 'closures.new',
                title: 'sidebar.closures.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/closures/new',
                permission: PERMISSIONS.CREATE_CLOSURES
            }
        ]
    },
    {
        id: 'accessories',
        title: 'sidebar.accessories.title',
        type: 'collapsable',
        // permission: PERMISSIONS.VIEW_ACCESSORIES,
        children: [
            {
                id: 'accessories.list',
                title: 'sidebar.accessories.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/accessories/list',
                // permission: PERMISSIONS.VIEW_ACCESSORIES
            },
            {
                id: 'accessories.new',
                title: 'sidebar.accessories.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/accessories/new',
                // permission: PERMISSIONS.CREATE_ACCESSORIES
            }
        ],
    },
    {
        id: 'taxes',
        title: 'sidebar.taxes.title',
        type: 'collapsable',
        // permission: PERMISSIONS.VIEW_TAXES,
        children: [
            {
                id: 'taxes.list-prime',
                title: 'sidebar.taxes.list_prime',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/taxes/list',
                // permission: PERMISSIONS.VIEW_TAXES
            },
            {
                id: 'taxes.list-accessories',
                title: 'sidebar.taxes.list_accessories',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/taxes/list',
                // permission: PERMISSIONS.VIEW_TAXES
            },
            {
                id: 'taxes.new',
                title: 'sidebar.taxes.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/taxes/new',
                // permission: PERMISSIONS.CREATE_TAXES
            },
            {
                id: 'regime-taxes.list',
                title: 'sidebar.taxes.regime_taxes',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/taxes/regime-taxes/list',
                // permission: PERMISSIONS.VIEW_TAXES
            },
        ],
    },
    {
        id: 'commissions',
        title: 'sidebar.commissions.title',
        type: 'collapsable',
        // permission: PERMISSIONS.VIEW_COMMISSIONS,
        children: [
            {
                id: 'commissions.list-prime',
                title: 'sidebar.commissions.list_prime',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/commissions/list',
                // permission: PERMISSIONS.VIEW_COMMISSIONS
            },
            {
                id: 'commissions.list-accessories',
                title: 'sidebar.commissions.list_accessories',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/commissions/list',
                // permission: PERMISSIONS.VIEW_COMMISSIONS
            },
            {
                id: 'commissions-taxes.list',
                title: 'sidebar.commissions_taxes.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/commissions/regime-commissions/list',
                // permission: PERMISSIONS.VIEW_COMMISSIONS
            },
            {
                id: 'commissions.new',
                title: 'sidebar.commissions.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/commissions/new',
                // permission: PERMISSIONS.CREATE_COMMISSIONS
            }
        ],
    },
        {
        id: 'production_registries',
        title: 'sidebar.production_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES,
        children: [
            {
                id: 'production_registries.list',
                title: 'sidebar.production_registries.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/production-registries/list',
                permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES
            },
            {
                id: 'production_registries.new',
                title: 'sidebar.production_registries.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/production-registries/new',
                permission: PERMISSIONS.CREATE_PRODUCTION_REGISTRIES
            }
        ]
    },
    {
        id: 'insured_registries',
        title: 'sidebar.insured_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_INSURED_REGISTRIES,
        children: [
            {
                id: 'insured_registries.list',
                title: 'sidebar.insured_registries.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/insured-registries/list',
                permission: PERMISSIONS.VIEW_INSURED_REGISTRIES
            },
            {
                id: 'insured_registries.new',
                title: 'sidebar.insured_registries.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/insured-registries/new',
                permission: PERMISSIONS.CREATE_INSURED_REGISTRIES
            }
        ]
    },
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
    },
    {
        id: 'closures',
        title: 'sidebar.closures.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_CLOSURES,
        children: []
    }
];