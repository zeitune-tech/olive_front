import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { MarketLevelOrganization } from "./market-level-organization.interface";

@Injectable()
export class MarketLevelOrganizationService {

    baseUrl = environment.base_url;
    private _myMarketLevelOrganization: ReplaySubject<MarketLevelOrganization> = new ReplaySubject<MarketLevelOrganization>(1);
    private _entitySuperior: ReplaySubject<MarketLevelOrganization> = new ReplaySubject<MarketLevelOrganization>(1);
    private _entitiesSuperior: ReplaySubject<MarketLevelOrganization[]> = new ReplaySubject<MarketLevelOrganization[]>(1);
    private _entitiesSuperiorLinked: ReplaySubject<MarketLevelOrganization[]> = new ReplaySubject<MarketLevelOrganization[]>(1);

    set myMarketLevelOrganization(value: MarketLevelOrganization) {
        this._myMarketLevelOrganization.next(value);
    }

    get myMarketLevelOrganization$() {
        return this._myMarketLevelOrganization.asObservable();
    }

    set entitySuperior(value: MarketLevelOrganization) {
        this._entitySuperior.next(value);
    }

    get entitySuperior$() {
        return this._entitySuperior.asObservable();
    }

    set entitiesSuperior(value: MarketLevelOrganization[]) {
        this._entitiesSuperior.next(value);
    }

    get entitiesSuperior$() {
        return this._entitiesSuperior.asObservable();
    }

    set entitiesSuperiorLinked(value: MarketLevelOrganization[]) {
        this._entitiesSuperiorLinked.next(value);
    }

    get entitiesSuperiorLinked$() {
        return this._entitiesSuperiorLinked.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(entitySuperior: MarketLevelOrganization): Observable<MarketLevelOrganization> {
        return this._httpClient.post<MarketLevelOrganization>(`${this.baseUrl}/entities-superior`, entitySuperior)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as MarketLevelOrganization))
        );
    }

    getEntitiesSuperior(): Observable<MarketLevelOrganization[]> {
        return this._httpClient.get<MarketLevelOrganization[]>(`${this.baseUrl}/entities-superior/all`)
        .pipe(
            tap((entitiesSuperior) => {
                this.entitiesSuperior = entitiesSuperior;
                return (entitiesSuperior);
            }),
            catchError(() => of([] as MarketLevelOrganization[]))
        );
    }

    getMarketLevelOrganization(id: number): Observable<MarketLevelOrganization> {
        return this._httpClient.get<MarketLevelOrganization>(`${this.baseUrl}/entities-superior/${id}`)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as MarketLevelOrganization))
        );
    }

    getEntitiesSuperiorLinked(): Observable<MarketLevelOrganization[]> {
        return this._httpClient.get<MarketLevelOrganization[]>(`${this.baseUrl}/entities-superior`)
        .pipe(
            tap((entitiesSuperior) => {
                this.entitiesSuperiorLinked = entitiesSuperior;
                return (entitiesSuperior);
            }),
            catchError(() => of([] as MarketLevelOrganization[]))
        );
    }

    updateMarketLevelOrganization(entitySuperior: MarketLevelOrganization): Observable<MarketLevelOrganization> {
        return this._httpClient.put<MarketLevelOrganization>(`${this.baseUrl}/entities-superior/${entitySuperior.id}`, entitySuperior)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as MarketLevelOrganization))
        );
    }
}