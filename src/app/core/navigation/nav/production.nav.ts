/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultProductionNavigation: NavigationItem[] = [
    {
        id: 'production-mono',
        title: 'sidebar.production_mono.title',
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        // permission: PERMISSIONS.VIEW_INSUREDS,
        children: [
            {
                id: 'new-business',
                title: 'sidebar.production_mono.new_business',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/new-business',
            },
            {
                id: 'amendments',
                title: 'sidebar.production_mono.amendments',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/amendments',
            }, 
            {
                id: 'cancellations',
                title: 'sidebar.production_mono.cancellations',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/cancellations',
            },
            {
                id: 'production-list',
                title: 'sidebar.production_mono.production_list',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/production-list',
            },
            {
                id: 'vehicle',
                title: 'sidebar.production_mono.vehicle',
                type: 'basic',
                icon: 'fluent:vehicle-car',
                link: '/production/mono/vehicle',
            },
            {
                id: 'insured',
                title: 'sidebar.production_mono.insured',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/insured',
            },
        ]
    },
        {
        id: 'production-fleet',
        title: 'sidebar.production_fleet.title',
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        // permission: PERMISSIONS.VIEW_INSUREDS,
        children: [
            {
                id: 'new-business',
                title: 'sidebar.production_fleet.new_business',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/new-business',
            },
            {
                id: 'amendments',
                title: 'sidebar.production_fleet.amendments',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/amendments',
            }, 
            {
                id: 'cancellations',
                title: 'sidebar.production_fleet.cancellations',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/cancellations',
            },
            {
                id: 'production-list',
                title: 'sidebar.production_fleet.production_list',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/production-list',
            },
            {
                id: 'vehicle',
                title: 'sidebar.production_fleet.vehicle',
                type: 'basic',
                icon: 'fluent:vehicle-car',
                link: '/production/mono/vehicle',
            },
            {
                id: 'insured',
                title: 'sidebar.production_fleet.insured',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono/insured',
            },
        ]
    },
];


export const compactProductionNavigation: NavigationItem[] = [
    {
        id: 'insured-module',
        title: 'sidebar.insureds.title', // Ajoute la clé i18n correspondante
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        // permission: PERMISSIONS.VIEW_INSUREDS,
    },
    {
        id: 'vehicle-module',
        title: 'sidebar.vehicles.title',
        type: 'collapsable',
        icon: 'fluent:vehicle-car',
        // permission: PERMISSIONS.VIEW_VEHICLES,
    }
]