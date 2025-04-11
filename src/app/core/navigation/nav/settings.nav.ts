/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultSettingsNavigation: NavigationItem[] = [
    {
        id: 'coverages',
        title: 'sidebar.coverages.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COVERAGES,
        children: [
            {
                id: 'coverages.list-referiential',
                title: 'sidebar.coverages.referential',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/referentials',
                permission: PERMISSIONS.VIEW_COVERAGES
            },
            {
                id: 'coverages.list',
                title: 'sidebar.coverages.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/list',
                permission: PERMISSIONS.VIEW_COVERAGES
            },
            {
                id: 'incompatible-coverages-list',
                title: 'sidebar.incompatible_coverages.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/incompatibilities',
                permission: PERMISSIONS.VIEW_COVERAGES
            },
            {
                id: 'coverages-new',
                title: 'sidebar.coverages.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/new',
                permission: PERMISSIONS.CREATE_COVERAGES
            },
            {
                id: 'incompatible-coverages-new',
                title: 'sidebar.incompatible_coverages.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverages/new-incompatibility',
                permission: PERMISSIONS.CREATE_COVERAGES
            }
        ]
    },
    {
        id: 'coverage-durations',
        title: 'sidebar.coverage_durations.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS,
        children: [
            {
                id: 'coverage-durations.list',
                title: 'sidebar.coverage_durations.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverage-durations/list',
                permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS
            },
            {
                id: 'coverage-durations.new',
                title: 'sidebar.coverage_durations.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/coverage-durations/new',
                permission: PERMISSIONS.CREATE_COVERAGE_DURATIONS
            },

        ]
    },
    {
        id: 'production_registries',
        title: 'sidebar.production_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES,
        children: [
            {
                id: 'production_registries.list',
                title: 'sidebar.production_registries.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/production-registries/list',
                permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES
            },
            {
                id: 'production_registries.new',
                title: 'sidebar.production_registries.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/production-registries/new',
                permission: PERMISSIONS.CREATE_PRODUCTION_REGISTRIES
            }
        ]
    },
    {
        id: 'insured_registries',
        title: 'sidebar.insured_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_INSURED_REGISTRIES,
        children: [
            {
                id: 'insured_registries.list',
                title: 'sidebar.insured_registries.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/insured-registries/list',
                permission: PERMISSIONS.VIEW_INSURED_REGISTRIES
            },
            {
                id: 'insured_registries.new',
                title: 'sidebar.insured_registries.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/insured-registries/new',
                permission: PERMISSIONS.CREATE_INSURED_REGISTRIES
            }
        ]
    },
    {
        id: 'closures',
        title: 'sidebar.closures.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_CLOSURES,
        children: [
            {
                id: 'closures.list',
                title: 'sidebar.closures.list',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/closures/list',
                permission: PERMISSIONS.VIEW_CLOSURES
            },
            {
                id: 'closures.new',
                title: 'sidebar.closures.new',
                type: 'basic',
                icon: 'fluent:people-team',
                link: '/parameters/closures/new',
                permission: PERMISSIONS.CREATE_CLOSURES
            }
        ]
    },
];
export const compactSettingsNavigation: NavigationItem[] = [
    {
        id: 'coverages',
        title: 'sidebar.coverages.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        link: '/parameters/dashboard',
        permission: PERMISSIONS.VIEW_COVERAGES_REFERENCES,
        children: []
    },
    {
        id: 'coverage-durations',
        title: 'sidebar.coverage_durations.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_COVERAGE_DURATIONS,
        children: []
    },
    {
        id: 'production_registries',
        title: 'sidebar.production_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_PRODUCTION_REGISTRIES,
        children: []
    },
    {
        id: 'insured_registries',
        title: 'sidebar.insured_registries.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_INSURED_REGISTRIES,
        children: []
    },
    {
        id: 'closures',
        title: 'sidebar.closures.title',
        type: 'collapsable',
        icon: 'fluent:people-team',
        permission: PERMISSIONS.VIEW_CLOSURES,
        children: []
    }
];