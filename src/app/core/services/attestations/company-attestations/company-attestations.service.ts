import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { CompanyAttestations } from "./company-attestations.interface";

@Injectable({
    providedIn: 'root'
})
export class CompanyAttestationsService {

    baseUrl = environment.attestations_url + '/company-attestations';
    private _companyAttestation: ReplaySubject<CompanyAttestations> = new ReplaySubject<CompanyAttestations>(1);
    private _companyAttestations: ReplaySubject<CompanyAttestations[]> = new ReplaySubject<CompanyAttestations[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set companyAttestation(value: CompanyAttestations) {
        this._companyAttestation.next(value);
    }

    get companyAttestation$() {
        return this._companyAttestation.asObservable();
    }

    set companyAttestations(value: CompanyAttestations[]) {
        this._companyAttestations.next(value);
    }

    get companyAttestations$() {
        return this._companyAttestations.asObservable();
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

    create(item: CompanyAttestations): Observable<CompanyAttestations> {
        return this._httpClient.post<CompanyAttestations>(`${this.baseUrl}`, item)
        .pipe(
            tap((item) => {
                this.companyAttestation = item;
                return (item);
            }),
            catchError(() => of({} as CompanyAttestations))
        );
    }


    get(id: string): Observable<CompanyAttestations> {
        return this._httpClient.get<CompanyAttestations>(`${this.baseUrl}${id}`)
        .pipe(
            tap((item) => {
                this.companyAttestation = item;
                return (item);
            }),
            catchError(() => of({} as CompanyAttestations))
        );
    }


    getAll(): Observable<CompanyAttestations[]> {
        return this._httpClient.get<CompanyAttestations[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.companyAttestations = response?.content.map((item: CompanyAttestations) => {
                    return item;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as CompanyAttestations[]))
        );
    }
}