import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { IncompatibleCoverage } from "./incompatible-coverage.interface";

@Injectable({
    providedIn: 'root'
})
export class IncompatibleCoverageService {

    baseUrl = environment.settings_url + '/incompatible-coverages';
    private _incompatibleCoverage: ReplaySubject<IncompatibleCoverage> = new ReplaySubject<IncompatibleCoverage>(1);
    private _incompatibleCoverages: ReplaySubject<IncompatibleCoverage[]> = new ReplaySubject<IncompatibleCoverage[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);


    set incompatibleCoverage(value: IncompatibleCoverage) {
        this._incompatibleCoverage.next(value);
    }

    get incompatibleCoverage$() {
        return this._incompatibleCoverage.asObservable();
    }

    set incompatibleCoverages(value: IncompatibleCoverage[]) {
        this._incompatibleCoverages.next(value);
    }

    get incompatibleCoverages$() {
        return this._incompatibleCoverages.asObservable();
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

    create(incompatibleCoverage: IncompatibleCoverage): Observable<IncompatibleCoverage> {
        return this._httpClient.post<IncompatibleCoverage>(`${this.baseUrl}`, incompatibleCoverage)
        .pipe(
            tap((incompatibleCoverage) => {
                this.incompatibleCoverage = incompatibleCoverage;
                return (incompatibleCoverage);
            }),
            catchError(() => of({} as IncompatibleCoverage))
        );
    }


    get(id: string): Observable<IncompatibleCoverage> {
        return this._httpClient.get<IncompatibleCoverage>(`${this.baseUrl}${id}`)
        .pipe(
            tap((incompatibleCoverage) => {
                this.incompatibleCoverage = incompatibleCoverage;
                return (incompatibleCoverage);
            }),
            catchError(() => of({} as IncompatibleCoverage))
        );
    }


    getAll(): Observable<IncompatibleCoverage[]> {
        return this._httpClient.get<IncompatibleCoverage[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.incompatibleCoverages = response?.content.map((incompatibleCoverage: IncompatibleCoverage) => {
                    return incompatibleCoverage;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as IncompatibleCoverage[]))
        );
    }

    getWithFilters(filters: any): Observable<IncompatibleCoverage[]> {
        return this._httpClient.get<IncompatibleCoverage[]>(`${this.baseUrl}`, { params: filters })
        .pipe(
            tap((response : any) => {
                return response;
            }),
            catchError(() => of([] as IncompatibleCoverage[]))
        );
    }

    delete(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
        .pipe(
            tap(() => {
                this.incompatibleCoverages = this.incompatibleCoverages.filter((incompatibleCoverage: IncompatibleCoverage) => incompatibleCoverage.id !== id);
                return;
            }),
            catchError(() => of())
        );
    }
}
