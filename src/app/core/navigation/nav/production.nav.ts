/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultProductionNavigation: NavigationItem[] = [
    {
        id: 'production',
        title: 'sidebar.production.title',
        type: 'collapsable',
        icon: 'fluent:person-accounts',
        children: [
            {
                id: 'production-mono',
                title: 'sidebar.production_mono.title',
                type: 'collapsable',
                icon: 'fluent:person-accounts',
                children: [
                    {
                        id: 'affaire-nouvelle',
                        title: 'sidebar.affaire_nouvelle.title',
                        type: 'basic',
                        icon: 'fluent:document-add',
                        link: '/production/mono/affaire-nouvelle',
                    },
                    {
                        id: 'avenants',
                        title: 'sidebar.avenants.title',
                        type: 'basic',
                        icon: 'fluent:document-sync',
                        link: '/production/mono/avenants',
                    },
                    {
                        id: 'annulation',
                        title: 'sidebar.annulation.title',
                        type: 'basic',
                        icon: 'fluent:document-error',
                        link: '/production/mono/annulation',
                    }
                ]
            },
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

// Optionnel : compactProductionNavigation à adapter si besoin
export const compactProductionNavigation: NavigationItem[] = []