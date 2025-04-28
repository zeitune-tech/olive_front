import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { MarketLevelOrganizationAttestations } from "./market-level-organization-attestation.interface";

@Injectable({
    providedIn: 'root'
})
export class MarketLevelOrganizationAttestationsService {

    baseUrl = environment.attestations_url + '/mlo-attestations';
    private _marketLevelOrganizationAttestation: ReplaySubject<MarketLevelOrganizationAttestations> = new ReplaySubject<MarketLevelOrganizationAttestations>(1);
    private _marketLevelOrganizationAttestations: ReplaySubject<MarketLevelOrganizationAttestations[]> = new ReplaySubject<MarketLevelOrganizationAttestations[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set marketLevelOrganizationAttestation(value: MarketLevelOrganizationAttestations) {
        this._marketLevelOrganizationAttestation.next(value);
    }

    get marketLevelOrganizationAttestation$() {
        return this._marketLevelOrganizationAttestation.asObservable();
    }

    set marketLevelOrganizationAttestations(value: MarketLevelOrganizationAttestations[]) {
        this._marketLevelOrganizationAttestations.next(value);
    }

    get marketLevelOrganizationAttestations$() {
        return this._marketLevelOrganizationAttestations.asObservable();
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

    create(item: MarketLevelOrganizationAttestations): Observable<MarketLevelOrganizationAttestations> {
        return this._httpClient.post<MarketLevelOrganizationAttestations>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.marketLevelOrganizationAttestation = item;
                return (item);
            }),
            catchError(() => of({} as MarketLevelOrganizationAttestations))
        );
    }


    get(id: string): Observable<MarketLevelOrganizationAttestations> {
        return this._httpClient.get<MarketLevelOrganizationAttestations>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.marketLevelOrganizationAttestation = item;
                return (item);
            }),
            catchError(() => of({} as MarketLevelOrganizationAttestations))
        );
    }


    getAll(): Observable<MarketLevelOrganizationAttestations[]> {
        return this._httpClient.get<MarketLevelOrganizationAttestations[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.marketLevelOrganizationAttestations = response?.content.map((item: MarketLevelOrganizationAttestations) => {
                    return item;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as MarketLevelOrganizationAttestations[]))
        );
    }
}