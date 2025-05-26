/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultProductionNavigation: NavigationItem[] = [
    {
        id: 'production',
        title: 'sidebar.production.title',
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        // permission: PERMISSIONS.VIEW_INSUREDS,
        children: [
            {
                id: 'new-production-mono',
                title: 'sidebar.production_mono.title',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/mono',
            },
            {
                id: 'new-production-fleet',
                title: 'sidebar.production_fleet.title',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/production/fleet',
            }
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