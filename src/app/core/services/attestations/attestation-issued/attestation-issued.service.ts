import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { AttestationIssued } from "./attestation-issued.interface";

@Injectable({
    providedIn: 'root'
})
export class AttestationIssuedService {

    baseUrl = environment.attestations_url + '/attestation-issueds';
    private _attestationIssued: ReplaySubject<AttestationIssued> = new ReplaySubject<AttestationIssued>(1);
    private _attestationIssueds: ReplaySubject<AttestationIssued[]> = new ReplaySubject<AttestationIssued[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set attestationIssued(value: AttestationIssued) {
        this._attestationIssued.next(value);
    }

    get attestationIssued$() {
        return this._attestationIssued.asObservable();
    }

    set attestationIssueds(value: AttestationIssued[]) {
        this._attestationIssueds.next(value);
    }

    get attestationIssueds$() {
        return this._attestationIssueds.asObservable();
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

    create(item: AttestationIssued): Observable<AttestationIssued> {
        return this._httpClient.post<AttestationIssued>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.attestationIssued = item;
                return (item);
            }),
            catchError(() => of({} as AttestationIssued))
        );
    }


    get(id: string): Observable<AttestationIssued> {
        return this._httpClient.get<AttestationIssued>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.attestationIssued = item;
                return (item);
            }),
            catchError(() => of({} as AttestationIssued))
        );
    }


    getAll(): Observable<AttestationIssued[]> {
        return this._httpClient.get<AttestationIssued[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.attestationIssueds = response?.content.map((item: AttestationIssued) => {
                    return item;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as AttestationIssued[]))
        );
    }
}