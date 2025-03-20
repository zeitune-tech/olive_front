import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Attestation, AttestationLot } from "./attestation.interface";

@Injectable()
export class AttestationService {

    baseUrl = environment.base_url;
    
    private _attestation: ReplaySubject<Attestation> = new ReplaySubject<Attestation>(1);
    private _attestations: ReplaySubject<Attestation[]> = new ReplaySubject<Attestation[]>(1);
    private _myAttestations: ReplaySubject<AttestationLot[]> = new ReplaySubject<AttestationLot[]>(1);

    set attestation(value: Attestation) {
        this._attestation.next(value);
    }

    get attestation$() {
        return this._attestation.asObservable();
    }

    set attestations(value: Attestation[]) {
        this._attestations.next(value);
    }

    get attestations$() {
        return this._attestations.asObservable();
    }

    set myAttestations(value: AttestationLot[]) {
        this._myAttestations.next(value);
    }

    get myAttestations$() {
        return this._myAttestations.asObservable();
    }

    constructor(
        private http: HttpClient
    ) { }

    create(attestation: Attestation): Observable<Attestation> {
        return this.http.post<Attestation>(`${this.baseUrl}/attestations`, attestation)
        .pipe(
            tap((attestation) => {
                this.attestation = attestation;
                return (attestation);
            }),
            catchError(() => of({} as Attestation))
        );
    }

    getAttestations(): Observable<Attestation[]> {
        return this.http.get<Attestation[]>(`${this.baseUrl}/attestations`)
        .pipe(
            tap((attestations) => {
                this.attestations = attestations;
                return (attestations);
            }),
            catchError(() => of([] as Attestation[]))
        );
    }

    getMyAttestations(): Observable<AttestationLot[]> {
        return this.http.get<AttestationLot[]>(`${this.baseUrl}/attestations/lot`)
        .pipe(
            tap((attestations) => {
                this.myAttestations = attestations;
                return (attestations);
            }),
            catchError(() => of([] as AttestationLot[]))
        );
    }

    getAttestation(id: number): Observable<Attestation> {
        return this.http.get<Attestation>(`${this.baseUrl}/attestations/${id}`)
        .pipe(
            tap((attestation) => {
                this.attestation = attestation;
                return (attestation);
            }),
            catchError(() => of({} as Attestation))
        );
    }


    attribute(attestationId: string, managementEntityId: string, data: any): Observable<AttestationLot> {
        return this.http.post<AttestationLot>(`${this.baseUrl}/attestations/attribute/${attestationId}/${managementEntityId}`, data)
        .pipe(
            tap((attestation) => {
                return (attestation);
            }),
            catchError(() => of({} as AttestationLot))
        );
    }

    updateAttestation(attestation: Attestation): Observable<Attestation> {
        return this.http.put<Attestation>(`${this.baseUrl}/attestations/${attestation.id}`, attestation)
        .pipe(
            tap((attestation) => {
                this.attestation = attestation;
                return (attestation);
            }),
            catchError(() => of({} as Attestation))
        );
    }
}