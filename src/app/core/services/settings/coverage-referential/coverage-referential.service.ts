import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { CoverageReference } from "./coverage-referential.interface";

@Injectable()
export class CoverageReferentialService {

    baseUrl = environment.administration_url + '/coverage-referentials';
    private _coverageReferential: ReplaySubject<CoverageReference> = new ReplaySubject<CoverageReference>(1);
    private _coverageReferentials: ReplaySubject<CoverageReference[]> = new ReplaySubject<CoverageReference[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);
        

    set coverage(value: CoverageReference) {
        this._coverageReferential.next(value);
    }

    get coverage$() {
        return this._coverageReferential.asObservable();
    }

    set coverageReferentials(value: CoverageReference[]) {
        this._coverageReferentials.next(value);
    }

    get coverageReferentials$() {
        return this._coverageReferentials.asObservable();
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

    create(coverage: CoverageReference): Observable<CoverageReference> {
        return this._httpClient.post<CoverageReference>(`${this.baseUrl}/coverageReferentials`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError(() => of({} as CoverageReference))
        );
    }


    get(id: string): Observable<CoverageReference> {
        return this._httpClient.get<CoverageReference>(`${this.baseUrl}${id}`)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError(() => of({} as CoverageReference))
        );
    }


    getAll(): Observable<CoverageReference[]> {
        return this._httpClient.get<CoverageReference[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : any) => {
                this.coverageReferentials = response?.content.map((coverage: CoverageReference) => {
                    return coverage;
                });
                this.metadata = response;
                return response;
            }),
            catchError(() => of([] as CoverageReference[]))
        );
    }
}