import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { LotAttestation } from "./lot-attestation.interface";

@Injectable({
    providedIn: 'root'
})
export class LotAttestationsService {

    baseUrl = environment.attestations_url + '/lot-attestations';
    private _lotAttestation: ReplaySubject<LotAttestation> = new ReplaySubject<LotAttestation>(1);
    private _lotAttestations: ReplaySubject<LotAttestation[]> = new ReplaySubject<LotAttestation[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set lotAttestation(value: LotAttestation) {
        this._lotAttestation.next(value);
    }

    get lotAttestation$() {
        return this._lotAttestation.asObservable();
    }

    set lotAttestations(value: LotAttestation[]) {
        this._lotAttestations.next(value);
    }

    get lotAttestations$() {
        return this._lotAttestations.asObservable();
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

    create(item: LotAttestation): Observable<LotAttestation> {
        return this._httpClient.post<LotAttestation>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.lotAttestation = item;
                return (item);
            }),
            catchError(() => of({} as LotAttestation))
        );
    }


    get(id: string): Observable<LotAttestation> {
        return this._httpClient.get<LotAttestation>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.lotAttestation = item;
                return (item);
            }),
            catchError(() => of({} as LotAttestation))
        );
    }


    getAll(): Observable<LotAttestation[]> {
        return this._httpClient.get<LotAttestation[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : LotAttestation[]) => {
                this.lotAttestations = response.map((item) => {
                    return new LotAttestation(item);
                });
                return response;
            }),
            catchError(() => of([] as LotAttestation[]))
        );
    }
}