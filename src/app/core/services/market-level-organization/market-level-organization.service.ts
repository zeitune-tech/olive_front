import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { MarketLevelOrganization } from "./market-level-organization.interface";
import { RequestMetadata } from "../common.interface";

@Injectable()
export class MarketLevelOrganizationService {

    baseUrl = environment.request_url + '/market-level-organizations';
    private _myMarketLevelOrganization: ReplaySubject<MarketLevelOrganization> = new ReplaySubject<MarketLevelOrganization>(1);
    private _marketLevelOrganization: ReplaySubject<MarketLevelOrganization> = new ReplaySubject<MarketLevelOrganization>(1);
    private _marketLevelOrganizations: ReplaySubject<MarketLevelOrganization[]> = new ReplaySubject<MarketLevelOrganization[]>(1);
    private _marketLevelOrganizationLinked: ReplaySubject<MarketLevelOrganization[]> = new ReplaySubject<MarketLevelOrganization[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    set myMarketLevelOrganization(value: MarketLevelOrganization) {
        this._myMarketLevelOrganization.next(value);
    }

    get myMarketLevelOrganization$() {
        return this._myMarketLevelOrganization.asObservable();
    }

    set entitySuperior(value: MarketLevelOrganization) {
        this._marketLevelOrganization.next(value);
    }

    get marketLevelOrganizations$() {
        return this._marketLevelOrganizations.asObservable();
    }

    set marketLevelOrganizations(value: MarketLevelOrganization[]) {
        this._marketLevelOrganizations.next(value);
    }

    get marketLevelOrganization$() {
        return this._marketLevelOrganization.asObservable();
    }

    set marketLevelOrganizationLinked(value: MarketLevelOrganization[]) {
        this._marketLevelOrganizationLinked.next(value);
    }

    get marketLevelOrganizationLinked$() {
        return this._marketLevelOrganizationLinked.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
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

    getAll(): Observable<MarketLevelOrganization[]> {
        return this._httpClient.get<MarketLevelOrganization[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.marketLevelOrganizations = response?.content.map((marketLevelOrganization: MarketLevelOrganization) => {
                    return marketLevelOrganization
                });
                this.metadata = response;
                return (response);
            }),
            catchError(() => of([] as MarketLevelOrganization[]))
        );
    }

    get(id: number): Observable<MarketLevelOrganization> {
        return this._httpClient.get<MarketLevelOrganization>(`${this.baseUrl}/${id}`)
        .pipe(
            tap((entitySuperior) => {
                this.entitySuperior = entitySuperior;
                return (entitySuperior);
            }),
            catchError(() => of({} as MarketLevelOrganization))
        );
    }

}