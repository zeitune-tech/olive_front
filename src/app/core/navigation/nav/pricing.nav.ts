/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultPrincingNavigation: NavigationItem[] = [
    {
        id: 'pricing',
        title: 'sidebar.pricing.formula',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/formula',
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
        children: [
            {
                id: 'formula',
                title: 'sidebar.pricing.formula_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/formula/list',
                // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
            },
            {
                id: 'new-formula',
                title: 'sidebar.pricing.new_formula',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/formula/new',
                // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
            },
        ]
    },
    {
        id: 'constants',
        title: 'sidebar.pricing.constants',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/constants',
        // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
        children: [
            {
                id: 'constant-list',
                title: 'sidebar.pricing.constant_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/constants/list',
                // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
            },
            {
                id: 'new-constant',
                title: 'sidebar.pricing.new_constant',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/constants/new',
                // permission: PERMISSIONS.CREATE_PRICING_CONSTANTS,
            },
        ]
    },
    {
        id: 'conditions',
        title: 'sidebar.pricing.conditions',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/conditions',
        // permission: PERMISSIONS.VIEW_PRICING_CONDITIONS,
        children: [
            {
                id: 'condition-list',
                title: 'sidebar.pricing.condition_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/conditions/list',
                // permission: PERMISSIONS.VIEW_PRICING_CONDITIONS,
            },
            {
                id: 'new-condition',
                title: 'sidebar.pricing.new_condition',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/conditions/new',
                // permission: PERMISSIONS.CREATE_PRICING_CONDITIONS,
            },
        ]
    },
    {
        id: 'caracteristics',
        title: 'sidebar.pricing.caracteristics',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/caracteristics',
        // permission: PERMISSIONS.VIEW_PRICING_CARACTERISTICS,
        children: [
            {
                id: 'caracteristic-list',
                title: 'sidebar.pricing.caracteristic_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/caracteristics/list',
                // permission: PERMISSIONS.VIEW_PRICING_CARACTERISTICS,
            },
            {
                id: 'new-caracteristic',
                title: 'sidebar.pricing.new_caracteristic',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/caracteristics/new',
                // permission: PERMISSIONS.CREATE_PRICING_CARACTERISTICS,
            },
        ]
    }
];
export const compactPrincingNavigation: NavigationItem[] = [];