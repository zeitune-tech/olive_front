import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { RequestMetadata } from "../../common.interface";
import { CoverageReference } from "./coverage-reference.interface";

@Injectable({
    providedIn: 'root'
})
export class CoverageReferenceService {

    baseUrl = environment.settings_url + '/app/coverage-references';
    private _coverageReferential: ReplaySubject<CoverageReference> = new ReplaySubject<CoverageReference>(1);
    private _coverageReferences: ReplaySubject<CoverageReference[]> = new ReplaySubject<CoverageReference[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);


    set coverage(value: CoverageReference) {
        this._coverageReferential.next(value);
    }

    get coverage$() {
        return this._coverageReferential.asObservable();
    }

    set coverageReferentials(value: CoverageReference[]) {
        this._coverageReferences.next(value);
    }

    get coverageReferences$() {
        return this._coverageReferences.asObservable();
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
        return this._httpClient.post<CoverageReference>(`${this.baseUrl}`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError((error) => {
                throw new Error("Error creating coverage reference: " + error);
            })
        );
    }

    update(coverage: any): Observable<CoverageReference> {
        return this._httpClient.put<CoverageReference>(`${this.baseUrl}/${coverage.id}`, coverage)
        .pipe(
            tap((coverage) => {
                this.coverage = coverage;
                return (coverage);
            }),
            catchError((error) => {
                throw new Error("Error updating coverage reference: " + error);
            })
        );
    }

    delete(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
        .pipe(
            tap(() => {
                this.coverage = {} as CoverageReference; // Reset coverage after deletion
                return;
            }),
            catchError((error) => {
                throw new Error("Error deleting coverage reference: " + error);
            })
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
            tap((response : CoverageReference[]) => {
                this.coverageReferentials = response?.map((coverage: CoverageReference) => {
                    return coverage;
                });
                // this.metadata = response;
                return response;
            }),
            catchError(() => of([] as CoverageReference[]))
        );
    }
}
