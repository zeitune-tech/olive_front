import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { CoverageDuration } from "./coverage-duration.interface";

@Injectable({
    providedIn: 'root'
})
export class CoverageDurationService {

    baseUrl = environment.settings_url + '/app/coverage-durations';
    private _coverageDuration: ReplaySubject<CoverageDuration> = new ReplaySubject<CoverageDuration>(1);
    private _coverageDurations: ReplaySubject<CoverageDuration[]> = new ReplaySubject<CoverageDuration[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);


    set coverageDuration(value: CoverageDuration) {
        this._coverageDuration.next(value);
    }

    get coverageDuration$() {
        return this._coverageDuration.asObservable();
    }

    set coverageDurations(value: CoverageDuration[]) {
        this._coverageDurations.next(value);
    }

    get coverageDurations$() {
        return this._coverageDurations.asObservable();
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

    create(coverage: CoverageDuration): Observable<CoverageDuration> {
        return this._httpClient.post<CoverageDuration>(`${this.baseUrl}`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverageDuration = coverage;
                return (coverage);
            }),
            catchError(() => of({} as CoverageDuration))
        );
    }

    update(coverage: any): Observable<CoverageDuration> {
        return this._httpClient.put<CoverageDuration>(`${this.baseUrl}`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverageDuration = coverage;
                return (coverage);
            }),
            catchError(() => of({} as CoverageDuration))
        );
    }

    get(id: string): Observable<CoverageDuration> {
        return this._httpClient.get<CoverageDuration>(`${this.baseUrl}${id}`)
        .pipe(
            tap((coverage) => {
                this.coverageDuration = coverage;
                return (coverage);
            }),
            catchError(() => of({} as CoverageDuration))
        );
    }


    getAll(): Observable<CoverageDuration[]> {
        return this._httpClient.get<CoverageDuration[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : CoverageDuration[]) => {
                this.coverageDurations = response?.map((coverage: CoverageDuration) => {
                    return coverage;
                });
                //this.metadata = response;
                return response;
            }),
            catchError(() => of([] as CoverageDuration[]))
        );
    }
}
