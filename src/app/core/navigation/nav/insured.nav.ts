/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultSettingsNavigation: NavigationItem[] = [
    {
        id: 'insured-module',
        title: 'sidebar.insureds.title', // Ajoute la clé i18n correspondante
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        // permission: PERMISSIONS.VIEW_INSUREDS,
        children: [
            {
                id: 'insureds.list',
                title: 'sidebar.insureds.list',
                type: 'basic',
                icon: 'fluent:person-accounts',
                link: '/insureds/list',
                // permission: PERMISSIONS.VIEW_INSUREDS
            },
            {
                id: 'insureds.new',
                title: 'sidebar.insureds.new',
                type: 'basic',
                icon: 'fluent:person-add',
                link: '/insureds/new',
                // permission: PERMISSIONS.CREATE_INSUREDS
            }
        ]
    },
    {
        id: 'vehicle-module',
        title: 'sidebar.vehicles.title',
        type: 'collapsable',
        icon: 'fluent:vehicle-car',
        // permission: PERMISSIONS.VIEW_VEHICLES,
        children: [
            {
                id: 'vehicles.list',
                title: 'sidebar.vehicles.list',
                type: 'basic',
                icon: 'fluent:vehicle-car',
                link: '/vehicles/list',
                // permission: PERMISSIONS.VIEW_VEHICLES
            },
            {
                id: 'vehicles.new',
                title: 'sidebar.vehicles.new',
                type: 'basic',
                icon: 'fluent:vehicle-car-profile-ltr',
                link: '/vehicles/new',
                // permission: PERMISSIONS.CREATE_VEHICLES
            }
        ]
    }
];


export const compactSettingsNavigation: NavigationItem[] = [
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