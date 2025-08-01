/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultProductionNavigation: NavigationItem[] = [
    {
    id: 'production-mono',
    title: 'Production Mono',
    type: 'collapsable',
    icon: 'fluent:car-20-regular',
    children: [
        { id: 'affaire-nouvelle', title: 'Affaire Nouvelle', type: 'basic', link: '/production/mono/new-business' },
        { id: 'avenants', title: 'Avenants', type: 'basic', link: '/production/mono/avenants' },
        { id: 'annulation', title: 'Annulation', type: 'basic', link: '/production/mono/annulation' },
        { id: 'production-consultation', title: 'Production [Consultation]', type: 'basic', link: '/production/mono/list-business' },
        { id: 'vehicule-consultation', title: 'Véhicule [Consultation]', type: 'basic', link: '/production/mono/vehicule-consultation' },
        { id: 'assure', title: 'Assuré', type: 'basic', link: '/production/mono/assure' },
        { id: 'assure-consultation', title: 'Assuré [Consultation]', type: 'basic', link: '/production/mono/assure-consultation' },
    ]
    },
    {
    id: 'production-flotte',
    title: 'Production Flotte',
    type: 'collapsable',
    icon: 'fluent:people-20-regular',
    children: [
        { id: 'affaire-nouvelle-flotte', title: 'Affaire Nouvelle', type: 'basic', link: '/production-flotte/affaire-nouvelle' },
        { id: 'avenants-flotte', title: 'Avenants', type: 'basic', link: '/production-flotte/avenants' },
        { id: 'annulation-flotte', title: 'Annulation', type: 'basic', link: '/production-flotte/annulation' },
        { id: 'production-consultation-flotte', title: 'Production [Consultation]', type: 'basic', link: '/production-flotte/production-consultation' },
        { id: 'vehicule-consultation-flotte', title: 'Véhicule [Consultation]', type: 'basic', link: '/production-flotte/vehicule-consultation' },
        { id: 'assure-flotte', title: 'Assuré', type: 'basic', link: '/production-flotte/assure' },
        { id: 'assure-consultation-flotte', title: 'Assuré [Consultation]', type: 'basic', link: '/production-flotte/assure-consultation' },
    ]
    },
    {
    id: 'gestion-attestations',
    title: 'Gestion des Attestations',
    type: 'collapsable',
    icon: 'fluent:document-checkmark-20-regular',
    children: [
        { id: 'affaire-nouvelle-attest', title: 'Affaire Nouvelle', type: 'basic', link: '/attestations/affaire-nouvelle' },
        { id: 'avenants-attest', title: 'Avenants', type: 'basic', link: '/attestations/avenants' },
        { id: 'annulation-attest', title: 'Annulation', type: 'basic', link: '/attestations/annulation' },
        { id: 'production-consultation-attest', title: 'Production [Consultation]', type: 'basic', link: '/attestations/production-consultation' },
        { id: 'vehicule-consultation-attest', title: 'Véhicule [Consultation]', type: 'basic', link: '/attestations/vehicule-consultation' },
        { id: 'assure-attest', title: 'Assuré', type: 'basic', link: '/attestations/assure' },
        { id: 'assure-consultation-attest', title: 'Assuré [Consultation]', type: 'basic', link: '/attestations/assure-consultation' },
    ]
    }
];


export const compactProductionNavigation: NavigationItem[] = [
    {
        id: 'production-flotte',
        title: 'sidebar.production_flotte.title',
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        children: [
            {
                id: 'affaire-nouvelle-flotte',
                title: 'sidebar.affaire_nouvelle_flotte.title',
                type: 'basic',
                icon: 'fluent:document-add',
                link: '/production/flotte/affaire-nouvelle',
            },
            {
                id: 'avenants-flotte',
                title: 'sidebar.avenants_flotte.title',
                type: 'basic',
                icon: 'fluent:document-sync',
                link: '/production/flotte/avenants',
            },
            {
                id: 'annulation-flotte',
                title: 'sidebar.annulation_flotte.title',
                type: 'basic',
                icon: 'fluent:document-error',
                link: '/production/flotte/annulation',
            }
        ]
    },
    {
        id: 'consultation',
        title: 'sidebar.consultation.title',
        type: 'collapsable',
        icon: 'fluent:search',
        children: [
            {
                id: 'consultation-production',
                title: 'sidebar.consultation_production.title',
                type: 'basic',
                icon: 'fluent:apps-list',
                link: '/consultation/production',
            },
            {
                id: 'consultation-vehicule',
                title: 'sidebar.consultation_vehicule.title',
                type: 'basic',
                icon: 'fluent:vehicle-car',
                link: '/consultation/vehicule',
            },
            {
                id: 'consultation-assure',
                title: 'sidebar.consultation_assure.title',
                type: 'basic',
                icon: 'fluent:person',
                link: '/consultation/assure',
            }
        ]
    },
    {
        id: 'gestion-attestations',
        title: 'sidebar.gestion_attestations.title',
        type: 'collapsable',
        icon: 'fluent:document-bullet-list',
        children: [
            {
                id: 'stock-central',
                title: 'sidebar.stock_central.title',
                type: 'basic',
                icon: 'fluent:box',
                link: '/attestations/stock-central',
            },
            {
                id: 'gestion-commandes',
                title: 'sidebar.gestion_commandes.title',
                type: 'basic',
                icon: 'fluent:clipboard-list',
                link: '/attestations/gestion-commandes',
            },
            {
                id: 'attribution-attestations',
                title: 'sidebar.attribution_attestations.title',
                type: 'collapsable',
                icon: 'fluent:arrow-swap',
                children: [
                    {
                        id: 'par-compagnies',
                        title: 'sidebar.par_compagnies.title',
                        type: 'basic',
                        icon: 'fluent:building',
                        link: '/attestations/attribution/compagnies',
                    },
                    {
                        id: 'par-points-vente',
                        title: 'sidebar.par_points_vente.title',
                        type: 'basic',
                        icon: 'fluent:store',
                        link: '/attestations/attribution/points-vente',
                    }
                ]
            },
            {
                id: 'retrait-stocks-points-vente',
                title: 'sidebar.retrait_stocks_points_vente.title',
                type: 'basic',
                icon: 'fluent:box-arrow-left',
                link: '/attestations/retrait-stocks-points-vente',
            },
            {
                id: 'suivi-attestations',
                title: 'sidebar.suivi_attestations.title',
                type: 'basic',
                icon: 'fluent:document-checkmark',
                link: '/attestations/suivi',
            }
        ]
    }
];
