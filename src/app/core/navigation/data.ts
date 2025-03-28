/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultNavigation: NavigationItem[] = [
    {
        id: 'products',
        title: 'sidebar.products.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/administration/dashboard',
        permission: PERMISSIONS.VIEW_PRODUCTS,
        children: [
            {
                id: 'products.list',
                title: 'sidebar.products.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/products/list',
                permission: PERMISSIONS.VIEW_PRODUCTS
            },
            {
                id: 'products-new',
                title: 'sidebar.products.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/products/new',
                permission: PERMISSIONS.CREATE_PRODUCTS
            }
        ]
    },
    {
        id: 'market-level-organization',
        title: 'sidebar.market_level_organization.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ALL_MARKET_LEVEL_ORGANIZATION,
        children: [
            {
                id: 'market-level-organization.list',
                title: 'sidebar.market_level_organization.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/market-level-organization/list',
                permission: PERMISSIONS.VIEW_ALL_MARKET_LEVEL_ORGANIZATION
            },

        ]
    },
    {
        id: 'companies',
        title: 'sidebar.companies.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COMPANIES,
        children: [
            {
                id: 'companies.list',
                title: 'sidebar.companies.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/companies/list',
                permission: PERMISSIONS.VIEW_COMPANIES
            },
            {
                id: 'companies-linked',
                title: 'sidebar.companies.linked',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/companies/linked',
                permission: PERMISSIONS.VIEW_LINKED_COMPANIES
            }
        ]
    },
    {
        id: 'points-of-sale',
        title: 'sidebar.points_of_sale.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ALL_COMPANY_POINTS_OF_SALE,
        children: [
            {
                id: 'points-of-sale-list',
                title: 'sidebar.points_of_sale.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/list',
                permission: PERMISSIONS.VIEW_ALL_COMPANY_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-broker',
                title: 'sidebar.points_of_sale.broker',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/broker',
                permission: PERMISSIONS.VIEW_LINKED_BROKERS
            },
            {
                id: 'points-of-sale-new',
                title: 'sidebar.points_of_sale.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/new',
                permission: PERMISSIONS.CREATE_COMPANY_POINTS_OF_SALE
            },
            {
                id: 'company-level-organization-list',
                title: 'sidebar.company_level_organization.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/company-level-organization/list',
                permission: PERMISSIONS.VIEW_ALL_COMPANY_LEVEL_ORGANIZATION
            },
            {
                id: 'company-level-organization-new',
                title: 'sidebar.company_level_organization.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/company-level-organization/new',
                permission: PERMISSIONS.CREATE_COMPANY_LEVEL_ORGANIZATION
            }
        ]
    },
    {
        id: 'profiles',
        title: 'sidebar.profiles.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_PROFILES,
        children: [
            {
                id: 'profiles-list',
                title: 'sidebar.profiles.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/profiles/list',
                permission: PERMISSIONS.VIEW_PROFILES
            },
            {
                id: 'profiles-new',
                title: 'sidebar.profiles.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/profiles/new',
                permission: PERMISSIONS.CREATE_PROFILES
            }
        ]
    },
    {
        id: 'users',
        title: 'sidebar.users.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_USERS,
        children: [
            {
                id: 'users-list',
                title: 'sidebar.users.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/users/list',
                permission: PERMISSIONS.VIEW_USERS
            },
            {
                id: 'users-new',
                title: 'sidebar.users.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/users/new',
                permission: PERMISSIONS.CREATE_USERS
            }
        ]
    }
];
export const compactNavigation: NavigationItem[] = [
    {
        id: 'market-level-organization',
        title: 'sidebar.market-level-organization',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ALL_MARKET_LEVEL_ORGANIZATION,
        children: []
    },
    {
        id: 'companies',
        title: 'sidebar.companies.',
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
        permission: PERMISSIONS.VIEW_COMPANY_POINTS_OF_SALE,
        children: []
    },
    {
        id: 'users',
        title: 'sidebar.users',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_USERS,
        children: []
    }
];