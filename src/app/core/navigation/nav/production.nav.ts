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
        { id: 'affaire-nouvelle', title: 'Affaire Nouvelle', type: 'basic', link: '/production-mono/affaire-nouvelle' },
        { id: 'avenants', title: 'Avenants', type: 'basic', link: '/production-mono/avenants' },
        { id: 'annulation', title: 'Annulation', type: 'basic', link: '/production-mono/annulation' },
        { id: 'production-consultation', title: 'Production [Consultation]', type: 'basic', link: '/production-mono/production-consultation' },
        { id: 'vehicule-consultation', title: 'Véhicule [Consultation]', type: 'basic', link: '/production-mono/vehicule-consultation' },
        { id: 'assure', title: 'Assuré', type: 'basic', link: '/production-mono/assure' },
        { id: 'assure-consultation', title: 'Assuré [Consultation]', type: 'basic', link: '/production-mono/assure-consultation' },
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