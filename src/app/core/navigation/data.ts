/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultNavigation: NavigationItem[] = [
    {
        id: 'insureds',
        title: 'sidebar.insureds',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_INSUREDS,
        children: [
            {
                id: 'insureds-list',
                title: 'sidebar.insureds-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/insureds/list',
                permission: PERMISSIONS.VIEW_INSUREDS
            },
            {
                id: 'insureds-new',
                title: 'sidebar.insureds-new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/insureds/new',
                permission: PERMISSIONS.CREATE_INSURED
            }
        ]
    },
    {
        id: 'entities-superior',
        title: 'sidebar.entities-superior',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ENTITIES_SUPERIOR,
        children: [
            {
                id: 'entities-superior-linked',
                title: 'sidebar.entities-superior-linked',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/entities-superior/linked',
                permission: PERMISSIONS.VIEW_ENTITIES_SUPERIOR
            },
            {
                id: 'entities-superior-list',
                title: 'sidebar.entities-superior-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/entities-superior/list',
                permission: PERMISSIONS.VIEW_LINKED_ENTITIES_SUPERIOR
            }
        ]
    },
    {
        id: 'companies',
        title: 'sidebar.companies',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COMPANIES,
        children: [
            {
                id: 'companies-linked',
                title: 'sidebar.companies-linked',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/companies/linked',
                permission: PERMISSIONS.VIEW_LINKED_COMPANIES
            },
            {
                id: 'companies-list',
                title: 'sidebar.companies-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/companies/list',
                permission: PERMISSIONS.VIEW_COMPANIES
            }
        ]
    },
    {
        id: 'points-of-sale',
        title: 'sidebar.points-of-sale',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_POINTS_OF_SALE,
        children: [
            {
                id: 'points-of-sale-list',
                title: 'sidebar.points-of-sale-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/points-of-sale/list',
                permission: PERMISSIONS.VIEW_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-broker',
                title: 'sidebar.points-of-sale-broker',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/points-of-sale/broker',
                permission: PERMISSIONS.VIEW_BROKER_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-new',
                title: 'sidebar.points-of-sale-new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/points-of-sale/new',
                permission: PERMISSIONS.CREATE_POINT_OF_SALE
            }
        ]
    },
    {
        id: 'attestations',
        title: 'sidebar.attestations',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ATTESTATIONS,
        children: [
            {
                id: 'attestations-list',
                title: 'sidebar.attestations-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/list',
                permission: PERMISSIONS.VIEW_ATTESTATIONS
            },
            {
                id: 'attestations-new',
                title: 'sidebar.attestations-new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/new',
                permission: PERMISSIONS.GENERATE_ATTESTATION
            },
            {
                id: 'attestations-attribute',
                title: 'sidebar.attestations-attribute',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/attribute',
                permission: PERMISSIONS.ATTRIBUTE_ATTESTATION
            }
        ]
    },
    {
        id: 'demands',
        title: 'sidebar.demands',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_DEMANDS,
        children: [
            {
                id: 'demands-list',
                title: 'sidebar.demands-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/demands/list',
                permission: PERMISSIONS.VIEW_DEMANDS
            }
        ]
    },
    {
        id: 'employees',
        title: 'sidebar.employees',
        type: 'group',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_EMPLOYEES,
        children: [
            {
                id: 'employees-list',
                title: 'sidebar.employees-list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/employees/list',
                permission: PERMISSIONS.VIEW_EMPLOYEES
            },
            {
                id: 'employees-new',
                title: 'sidebar.employees-new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/employees/new',
                permission: PERMISSIONS.CREATE_EMPLOYEE
            },
            {
                id: 'employees-roles',
                title: 'sidebar.employees-roles',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/employees/roles',
                permission: PERMISSIONS.UPDATE_EMPLOYEE_ROLE
            }
        ]
    }
];
export const compactNavigation: NavigationItem[] = [
    {
        id: 'insureds',
        title: 'sidebar.insureds',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_INSUREDS,
        children: []
    },
    {
        id: 'entities-superior',
        title: 'sidebar.entities-superior',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ENTITIES_SUPERIOR,
        children: []
    },
    {
        id: 'companies',
        title: 'sidebar.companies',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COMPANIES,
        children: []
    },
    {
        id: 'points-of-sale',
        title: 'sidebar.points-of-sale',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_POINTS_OF_SALE,
        children: []
    },
    {
        id: 'attestations',
        title: 'sidebar.attestations',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ATTESTATIONS,
        children: []
    },
    {
        id: 'demands',
        title: 'sidebar.demands',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_DEMANDS,
        children: []
    },
    {
        id: 'employees',
        title: 'sidebar.employees',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_EMPLOYEES,
        children: []
    }
];