import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { RemovedAttestations } from './removed-attestations.interface';

@Injectable({
    providedIn: 'root'
})
export class RemovedAttestationsService {

    baseUrl = environment.attestations_url + '/removed-attestations';
    private _removedAttestation: ReplaySubject<RemovedAttestations> = new ReplaySubject<RemovedAttestations>(1);
    private _removedAttestations: ReplaySubject<RemovedAttestations[]> = new ReplaySubject<RemovedAttestations[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set removedAttestation(value: RemovedAttestations) {
        this._removedAttestation.next(value);
    }

    get removedAttestation$() {
        return this._removedAttestation.asObservable();
    }

    set removedAttestations(value: RemovedAttestations[]) {
        this._removedAttestations.next(value);
    }

    get removedAttestations$() {
        return this._removedAttestations.asObservable();
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

    create(item: RemovedAttestations): Observable<RemovedAttestations> {
        return this._httpClient.post<RemovedAttestations>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.removedAttestation = item;
                return (item);
            }),
            catchError(() => of({} as RemovedAttestations))
        );
    }


    get(id: string): Observable<RemovedAttestations> {
        return this._httpClient.get<RemovedAttestations>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.removedAttestation = item;
                return (item);
            }),
            catchError(() => of({} as RemovedAttestations))
        );
    }


    getAll(): Observable<RemovedAttestations[]> {
        return this._httpClient.get<RemovedAttestations[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.removedAttestations = response?.content.map((item: RemovedAttestations) => {
                    return item;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as RemovedAttestations[]))
        );
    }
}