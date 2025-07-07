/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultAdministrationNavigation: NavigationItem[] = [

    {
        id: 'market-level-organization',
        title: 'sidebar.market_level_organization.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS,
        children: [
            {
                id: 'market-level-organization.list',
                title: 'sidebar.market_level_organization.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/market-level-organizations/list',
                permission: PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS
            }

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
        permission: PERMISSIONS.VIEW_POINTS_OF_SALE,
        children: [
            {
                id: 'points-of-sale-list',
                title: 'sidebar.points_of_sale.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/list',
                permission: PERMISSIONS.VIEW_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-new',
                title: 'sidebar.points_of_sale.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/new',
                permission: PERMISSIONS.CREATE_POINTS_OF_SALE
            },
            {
                id: 'company-level-organization-list',
                title: 'sidebar.company_level_organization.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/company-level-organizations/list',
                permission: PERMISSIONS.VIEW_COMPANY_LEVEL_ORGANIZATIONS
            },
            {
                id: 'company-level-organization-new',
                title: 'sidebar.company_level_organization.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/company-level-organizations/new',
                permission: PERMISSIONS.CREATE_COMPANY_LEVEL_ORGANIZATIONS
            },
            {
                id: 'points-of-sale-broker',
                title: 'sidebar.points_of_sale.broker',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/points-of-sale/broker',
                permission: PERMISSIONS.VIEW_BROKERS
            },
        ]
    },
    {
        id: 'contributors',
        title: 'sidebar.contributors.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        // permission: PERMISSIONS.VIEW_CONTRIBUTORS,
        children: [
            {
                id: 'contributors-list',
                title: 'sidebar.contributors.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/contributors/list',
                // permission: PERMISSIONS.VIEW_CONTRIBUTORS
            },
            {
                id: 'contributors-new',
                title: 'sidebar.contributors.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/contributors/new',
                // permission: PERMISSIONS.CREATE_CONTRIBUTORS
            }
        ]
    },
    {
        id: 'profiles',
        title: 'sidebar.profiles.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_USERS,
        children: [
            {
                id: 'profiles-list',
                title: 'sidebar.profiles.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/administration/profiles/list',
                permission: PERMISSIONS.VIEW_USERS
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
export const compactAdministrationNavigation: NavigationItem[] = [
    {
        id: 'market-level-organization',
        title: 'sidebar.market-level-organization',
        type: 'aside',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_MARKET_LEVEL_ORGANIZATIONS,
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
        permission: PERMISSIONS.VIEW_POINTS_OF_SALE,
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