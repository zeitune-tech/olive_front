/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultAttestationNavigation: NavigationItem[] = [
    {
        id: 'stock-central',
        title: 'sidebar.attestations.stock-central.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/stock-central',
        // permission: PERMISSIONS.VIEW_STOCK_CENTRAL
    },
    {
        id: 'gestion-commandes',
        title: 'sidebar.attestations.commandes.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/commandes',
        // permission: PERMISSIONS.VIEW_COMMANDES
    },
    {
        id: 'attribution-compagnies',
        title: 'sidebar.attestations.attributionCompagnies.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/attribution-compagnies',
        // permission: PERMISSIONS.VIEW_ATTRIBUTION_COMPAGNIES
    },
    {
        id: 'attribution-points-vente',
        title: 'sidebar.attestations.attributionPointsVente.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/attribution-points-vente',
        // permission: PERMISSIONS.VIEW_ATTRIBUTION_PDV
    },
    {
        id: 'retrait-stocks-pdv',
        title: 'sidebar.attestations.retraitStocksPDV.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/retrait-stocks',
        // permission: PERMISSIONS.VIEW_RETRAIT_STOCKS
    },
    {
        id: 'suivi-attestations',
        title: 'sidebar.attestations.suiviAttestations.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/suivi',
        // permission: PERMISSIONS.VIEW_SUIVI_ATTESTATIONS
    }

];
export const compactAttestationNavigation: NavigationItem[] = [
    {
        id: 'attestations',
        title: 'sidebar.attestations.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/attestations/dashboard',
        // permission: PERMISSIONS.VIEW_ATTESTATIONS
    },
    {
        id: 'stock-central',
        title: 'sidebar.attestations.stock-central.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/stock-central',
        // permission: PERMISSIONS.VIEW_STOCK_CENTRAL
    },
    {
        id: 'gestion-commandes',
        title: 'sidebar.attestations.commandes.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/commandes',
        // permission: PERMISSIONS.VIEW_COMMANDES
    },
    {
        id: 'attribution-compagnies',
        title: 'sidebar.attestations.attributionCompagnies.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/attribution-compagnies',
        // permission: PERMISSIONS.VIEW_ATTRIBUTION_COMPAGNIES
    },
    {
        id: 'attribution-points-vente',
        title: 'sidebar.attestations.attributionPointsVente.title',
        type: 'basic',                
        icon: 'fluent:people-team',
        link: '/attestations/attribution-points-vente',
        // permission: PERMISSIONS.VIEW_ATTRIBUTION_PDV
    },
    {
        id: 'retrait-stocks-pdv',
        title: 'sidebar.attestations.retraitStocksPDV.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/retrait-stocks',
        // permission: PERMISSIONS.VIEW_RETRAIT_STOCKS
    },
    {
        id: 'suivi-attestations',
        title: 'sidebar.attestations.suiviAttestations.title',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/attestations/suivi',
        // permission: PERMISSIONS.VIEW_SUIVI_ATTESTATIONS
    }
];