/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultPrincingNavigation: NavigationItem[] = [
  {
    id: 'constants',
    title: 'sidebar.pricing.constants',
    type: 'basic',
    icon: 'fluent:people-team',
    link: '/pricing/constants',
    // permission: PERMISSIONS.VIEW_PRICING_CONSTANTS,
    children: []
  },
  {
    id: 'pricing',
    title: 'sidebar.pricing.field',
    type: 'collapsable',
    icon: 'fluent:people-team',
    link: '/pricing/fields',
    // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
    children: [
      {
        id: 'field',
        title: 'sidebar.pricing.field_list',
        type: 'basic',
        icon: 'fluent:people-team',
        link: '/pricing/fields/list',
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
      },
      {
        id: 'select-field',
        title: 'sidebar.pricing.select_field',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/pricing/fields/list',
        // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
        children: [
          {
            id: 'select-field-option',
            title: 'sidebar.pricing.select_field_option',
            type: 'basic',
            icon: 'fluent:people-team',
            link: '/pricing/fields/select-options/list',
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
          },
          {
            id: 'select-field-option-value',
            title: 'sidebar.pricing.select_field_option_value',
            type: 'basic',
            icon: 'fluent:people-team',
            link: '/pricing/fields/select-options/values',
            // permission: PERMISSIONS.CREATE_PRICING_FORMULA,
          },
        ]
      },
    ]
  },
  {
    id: 'pricing',
    title: 'sidebar.pricing.variable_condition',
    type: 'basic',
    icon: 'fluent:people-team',
    link: '/pricing/variable-conditions/list',
    // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
    children: []
  },
  {
    id: 'pricing',
    title: 'sidebar.pricing.formula',
    type: 'basic',
    icon: 'fluent:people-team',
    link: '/pricing/formula',
    // permission: PERMISSIONS.VIEW_PRICING_FORMULA,
    children: []
  },
];
export const compactPrincingNavigation: NavigationItem[] = [];
