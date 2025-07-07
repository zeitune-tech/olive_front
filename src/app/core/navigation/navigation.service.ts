import { Injectable } from '@angular/core';
import { filter, Observable, of, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { Navigation } from './navigation.types';
import { defaultAdministrationNavigation, compactAdministrationNavigation } from './nav/administration.nav';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { PermissionsService } from '@core/permissions/permissions.service';
import { NavigationItem } from '@lhacksrt/components';
import { compactSettingsNavigation, defaultSettingsNavigation } from './nav/settings.nav';
import { compactAttestationNavigation, defaultAttestationNavigation } from './nav/attestation.nav';
import { compactInsuredNavigation, defaultInsuredNavigation } from './nav/insured.nav';
import { compactProductionNavigation, defaultProductionNavigation } from './nav/production.nav';
import { compactPrincingNavigation, defaultPrincingNavigation } from './nav/pricing.nav';
@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private destroy$ = new Subject<void>();

    private items: Navigation[] = [
        {
            compact: compactAdministrationNavigation,
            default: defaultAdministrationNavigation,
        }, 
        {
            compact: compactSettingsNavigation,
            default: defaultSettingsNavigation
        },
        {
            compact: compactAttestationNavigation,
            default: defaultAttestationNavigation
        },
        {
            compact: compactInsuredNavigation,
            default: defaultInsuredNavigation
        },
        {
            compact: compactProductionNavigation,
            default: defaultProductionNavigation
        },
        {
            compact: compactPrincingNavigation,
            default: defaultPrincingNavigation
        }
    ] as Navigation [];

    private currentNav: Navigation;
    private _navigation: ReplaySubject<Navigation[]> = new ReplaySubject<Navigation[]>(1);

    constructor(
        private _layoutService: LayoutService,
        private _router: Router,
        private _permissionsService: PermissionsService,
    ) {

        this.items.forEach((item: Navigation) => {
            this.checkPermissions(item.default);
            this.checkPermissions(item.compact)
        })

        const module = localStorage.getItem("module") || "";
        this.currentNav = this.getNavigation(module);
        

        this._router.events
        .pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this._layoutService.setNavigation(this.fillChildren(this.currentNav));
        });
    }


    private checkPermissions(navigation: NavigationItem[]): NavigationItem[] {
        navigation.forEach(item => {
            if (item.permission) {
                item.hidden = () => !this._permissionsService.hasPermission(item.permission as string);
                item.children?.forEach(child => {
                    if (child.permission) {
                        child.hidden = () => !this._permissionsService.hasPermission(child.permission as string);
                    }
                });
            } else {
                item.hidden = () => false;
            }
        });
        return navigation;
    }


    public getNavigation(module: string): Navigation {

        if (!module) {
            // curente path
            const path = "administration";
            module = path;
            localStorage.setItem("module", module);
        }

        switch (module.toLocaleLowerCase()) {
            case "administration" : return this.items[0];
            case "settings": return this.items[1];
            case "attestations": return this.items[2];
            case "insureds": return this.items[3];
            case "productions": return this.items[4];
            case "princing": return this.items[5];
            default : return this.items[0];
        }
    }

    set currentNavigation (nav: Navigation) {
        this.currentNav = nav;
    }


    private fillChildren(navigation: Navigation): Navigation {
        navigation.compact.forEach((compactNavItem) => {
            navigation.default.forEach((defaultNavItem) => {
                if (defaultNavItem.id === compactNavItem.id) {
                    compactNavItem.children = cloneDeep(defaultNavItem.children);
                }
            });
        });

        return navigation;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get navigation$(): Observable<Navigation[]> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    get(): Observable<Navigation[]> {
        return of(this.items).pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
