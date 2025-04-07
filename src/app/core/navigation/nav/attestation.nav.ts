/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultAttestationNavigation: NavigationItem[] = [
    {
        id: 'attestations',
        title: 'sidebar.attestations.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/attestations/dashboard',
        permission: PERMISSIONS.VIEW_ATTESTATIONS,
        children: [
            {
                id: 'attestations.list',
                title: 'sidebar.attestations.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/list',
                permission: PERMISSIONS.VIEW_ATTESTATIONS
            },
            {
                id: 'attestations.revoked',
                title: 'sidebar.attestations.revoked',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/revoked',
                permission: PERMISSIONS.VIEW_ATTESTATIONS
            },
            {
                id: 'attestations_new',
                title: 'sidebar.attestations.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/new',
                permission: PERMISSIONS.CREATE_ATTESTATIONS
            }
        ]
    },
    {
        id: 'market-level-organization',
        title: 'sidebar.attestation_demands.new',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_MARKET_LEVEL_ORGANIZATION,
        link: '/attestations/market-level-organization',
    },
    {
        id: 'companies',
        title: 'sidebar.attestation_demands.new',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_COMPANY,
        link: '/attestations/compagnies?allow-demand=true',
    },
    {
        id: 'attestation-demands',
        title: 'sidebar.attestation_demands.title',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_ATTESTATIONS_DEMANDS,
        link: '/attestations/demands',
    },
    {
        id: 'companies-deliver',
        title: 'sidebar.companies.title',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_COMPANY,
        link: '/attestations/compagnies?allow-deliver=true',
    },

    {
        id: 'points-of-sale',
        title: 'sidebar.attestation_points_of_sale.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE,
        children: [
            {
                id: 'points-of-sale-list',
                title: 'sidebar.attestation_points_of_sale.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/points-of-sale/list',
                permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-broker',
                title: 'sidebar.attestation_points_of_sale.broker',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/points-of-sale/broker',
                permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE
            },
            {
                id: 'points-of-sale-broker',
                title: 'sidebar.attestation_points_of_sale.group',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/attestations/points-of-sale/group',
                permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE
            }
        ]
    },

];
export const compactAttestationNavigation: NavigationItem[] = [
    {
        id: 'attestations',
        title: 'sidebar.attestations.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/attestations/dashboard',
        permission: PERMISSIONS.VIEW_ATTESTATIONS,
        children: []
    },
    {
        id: 'market-level-organization',
        title: 'sidebar.market_level_organization.title',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_MARKET_LEVEL_ORGANIZATION,
        link: '/attestations/market-level-organization/list',
    },
    {
        id: 'companies',
        title: 'sidebar.companies.title',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.CREATE_ATTESTATIONS_DEMANDS_TO_COMPANY,
        link: '/attestations/market-level-organization/list',
    },
    {
        id: 'companies-deliver',
        title: 'sidebar.companies.title',
        type: 'basic',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_COMPANY,
        link: '/attestations/market-level-organization/list',
    },
    {
        id: 'points-of-sale',
        title: 'sidebar.points_of_sale.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.DELIVER_ATTESTATIONS_TO_POINTS_OF_SALE,
        children: [
            
        ]
    },
];