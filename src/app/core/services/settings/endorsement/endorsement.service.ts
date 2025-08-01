import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "@core/services/common.interface";
import { environment } from "@env/environment";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { Endorsment } from "./endorsement.interface";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class EndorsementService {
    baseUrl = environment.settings_url + '/endorsements';
    private _endorsement = new ReplaySubject<Endorsment>(1);
    private _endorsements = new ReplaySubject<Endorsment[]>(1);
    private _metadata = new ReplaySubject<RequestMetadata>(1);
    
    set endorsement(value: Endorsment) {
        this._endorsement.next(value);
    }
    
    get endorsement$() {
        return this._endorsement.asObservable();
    }
    
    set endorsements(value: Endorsment[]) {
        this._endorsements.next(value);
    }
    
    get endorsements$() {
        return this._endorsements.asObservable();
    }
    
    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }
    
    get metadata$() {
        return this._metadata.asObservable();
    }
    
    constructor(private _httpClient: HttpClient) {}

    create(endorsement: Endorsment): Observable<Endorsment> {
        return this._httpClient.post<Endorsment>(`${this.baseUrl}`, endorsement).pipe(
            tap((res) => this.endorsement = res),
            catchError(() => of({} as Endorsment))
        );
    }
    get(id: string): Observable<Endorsment> {
        return this._httpClient.get<Endorsment>(`${this.baseUrl}/${id}`).pipe(
            tap((res) => this.endorsement = res),
            catchError(() => of({} as Endorsment))
        );
    }

    getAll(): Observable<Endorsment[]> {
        return this._httpClient.get<Endorsment[]>(this.baseUrl).pipe(
            tap((response: Endorsment[]) => {
                this.endorsements = response;
                return response;
            }),
            catchError(() => of([] as Endorsment[]))
        );
    }

    update(id: string, endorsement: any): Observable<Endorsment> {
        return this._httpClient.put<Endorsment>(`${this.baseUrl}/${id}`, endorsement).pipe(
            tap((res) => {
                this.endorsement = res;
                return (res);
            }),
            catchError(() => of({} as Endorsment))
        );        
    }

    assignProducts(endorsementId: string, productIds: string[]): Observable<any> {
        return this._httpClient.post(`${this.baseUrl}/${endorsementId}/products`, { productIds });
    }
}