import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { PointOfSaleAttestations } from "./point-of-sale-attestations.interface";

@Injectable({
    providedIn: 'root'
})
export class PointOfSaleAttestationsService {

    baseUrl = environment.attestations_url + '/point-of-sale-attestations';
    private _pointOfSaleAttestation: ReplaySubject<PointOfSaleAttestations> = new ReplaySubject<PointOfSaleAttestations>(1);
    private _pointOfSaleAttestations: ReplaySubject<PointOfSaleAttestations[]> = new ReplaySubject<PointOfSaleAttestations[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set pointOfSaleAttestation(value: PointOfSaleAttestations) {
        this._pointOfSaleAttestation.next(value);
    }

    get pointOfSaleAttestation$() {
        return this._pointOfSaleAttestation.asObservable();
    }

    set pointOfSaleAttestations(value: PointOfSaleAttestations[]) {
        this._pointOfSaleAttestations.next(value);
    }

    get pointOfSaleAttestations$() {
        return this._pointOfSaleAttestations.asObservable();
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

    create(item: PointOfSaleAttestations): Observable<PointOfSaleAttestations> {
        return this._httpClient.post<PointOfSaleAttestations>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.pointOfSaleAttestation = item;
                return (item);
            }),
            catchError(() => of({} as PointOfSaleAttestations))
        );
    }


    get(id: string): Observable<PointOfSaleAttestations> {
        return this._httpClient.get<PointOfSaleAttestations>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.pointOfSaleAttestation = item;
                return (item);
            }),
            catchError(() => of({} as PointOfSaleAttestations))
        );
    }


    getAll(): Observable<PointOfSaleAttestations[]> {
        return this._httpClient.get<PointOfSaleAttestations[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.pointOfSaleAttestations = response?.content.map((item: PointOfSaleAttestations) => {
                    return item;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as PointOfSaleAttestations[]))
        );
    }
}