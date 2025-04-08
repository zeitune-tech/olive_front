import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { Coverage } from "./coverage.interface";

@Injectable({
    providedIn: 'root'
})
export class CoverageService {

    baseUrl = environment.settings_url + '/coverages';
    private _coverage: ReplaySubject<Coverage> = new ReplaySubject<Coverage>(1);
    private _coverages: ReplaySubject<Coverage[]> = new ReplaySubject<Coverage[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set coverage(value: Coverage) {
        this._coverage.next(value);
    }

    get coverage$() {
        return this._coverage.asObservable();
    }

    set coverages(value: Coverage[]) {
        this._coverages.next(value);
    }

    get coverages$() {
        return this._coverages.asObservable();
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

    create(coverage: Coverage): Observable<Coverage> {
        return this._httpClient.post<Coverage>(`${this.baseUrl}/coverages`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError(() => of({} as Coverage))
        );
    }


    get(id: string): Observable<Coverage> {
        return this._httpClient.get<Coverage>(`${this.baseUrl}${id}`)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError(() => of({} as Coverage))
        );
    }


    getAll(): Observable<Coverage[]> {
        return this._httpClient.get<Coverage[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.coverages = response?.content.map((coverage: Coverage) => {
                    return coverage;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as Coverage[]))
        );
    }

    getWithFilters(filters: HttpParams): Observable<Coverage[]> {
        return this._httpClient.get<Coverage[]>(`${this.baseUrl}`, { params: filters })
        .pipe(
            tap((response : any) => {
                return response;
            }),
            catchError(() => of([] as Coverage[]))
        );
    }
}