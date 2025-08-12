/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultPricingNavigation: NavigationItem[] = [
  {
    id: 'production',
    title: 'sidebar.pricing.production.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    link: '/pricing/production',
    // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
    children: [
      {
        id: 'parameters',
        title: 'sidebar.pricing.production.parameters',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/production/parameters',
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
        children: [
          {
            id: 'constants',
            title: 'sidebar.pricing.constants',
            type: 'basic',
            icon: 'fluent:people-team',
            link: '/pricing/production/parameters/constants',
            // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
            children: []
          },
          {
            id: 'field',
            title: 'sidebar.pricing.field',
            type: 'collapsable',
            icon: 'fluent:people-team',
            link: '/pricing/production/parameters/fields',
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
            children: [
              {
                id: 'select-field',
                title: 'sidebar.pricing.select_field',
                type: 'collapsable',
                icon: 'fluent:people-team',
                link: '/pricing/production/parameters/fields/list',
                // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
                children: [
                  {
                    id: 'select-field-option-value',
                    title: 'sidebar.pricing.select_field_option_value',
                    type: 'basic',
                    icon: 'fluent:people-team',
                    link: '/pricing/production/parameters/fields/select-options/values',
                    // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
                  },
                  {
                    id: 'select-field-option',
                    title: 'sidebar.pricing.select_field_option',
                    type: 'basic',
                    icon: 'fluent:people-team',
                    link: '/pricing/production/parameters/fields/select-options/list',
                    // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
                  },

                ]
              },
              {
                id: 'field',
                title: 'sidebar.pricing.field_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/production/parameters/fields/list',
                // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
              },
            ]
          },
          {
            id: 'variable_condition',
            title: 'sidebar.pricing.variable_condition',
            type: 'basic',
            icon: 'fluent:people-team',
            link: '/pricing/production/parameters/variable-conditions/list',
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
            children: []
          },
          {
            id: 'formula',
            title: 'sidebar.pricing.formula',
            type: 'collapsable',
            icon: 'fluent:people-team',
            link: '/pricing/production/parameters/formula',
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
            children: [
              {
                id: 'pricing-formula-create',
                title: 'sidebar.pricing.formula_create',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/production/parameters/formula/create',
                // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
              },
              {
                id: 'pricing-formula',
                title: 'sidebar.pricing.formula_list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/pricing/production/parameters/formula/list',
                // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
              },
            ]
          },
        ]
      },
      {
        id: 'pricing',
        title: 'sidebar.pricing.production.pricing',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/production/pricing',
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
        children: [
          {
            id: 'pricing-type',
            title: 'sidebar.pricing.production.pricing_type',
            type: 'basic',
            icon: 'fluent:people-team',
            link: '/pricing/production/pricing-type',
            // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
          },
        ]
      },

    ]
  },
  {
    id: 'sinister',
    title: 'sidebar.pricing.sinister.title',
    type: 'collapsable',
    icon: 'fluent:people-team',
    link: '/pricing/sinister',
    // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
    children: []
  },

];
export const compactPricingNavigation: NavigationItem[] = [];
