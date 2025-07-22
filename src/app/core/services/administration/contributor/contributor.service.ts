import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Contributor } from "./contributor.interface";
import { environment } from "@env/environment";
import { RequestMetadata } from "../../common.interface";

@Injectable({
    providedIn: 'root'
})
export class ContributorService {

    private baseUrl = environment.administration_url + '/contributors';

    private _contributor: ReplaySubject<Contributor> = new ReplaySubject<Contributor>(1);
    private _contributors: ReplaySubject<Contributor[]> = new ReplaySubject<Contributor[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);

    set contributor(value: Contributor) {
        this._contributor.next(value);
    }

    get contributor$() {
        return this._contributor.asObservable();
    }

    set contributors(value: Contributor[]) {
        this._contributors.next(value);
    }

    get contributors$() {
        return this._contributors.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }

    constructor(private _httpClient: HttpClient) {}

    create(contributor: any): Observable<Contributor> {
        return this._httpClient.post<Contributor>(`${this.baseUrl}`, contributor).pipe(
            tap((created) => this.contributor = created),
            catchError(error => of(error.error))
        );
    }

    get(): Observable<Contributor> {
        return this._httpClient.get<Contributor>(`${this.baseUrl}/me`).pipe(
            tap((data) => this.contributor = data),
            catchError(() => of({} as Contributor))
        );
    }

    getAll(): Observable<Contributor[]> {
        return this._httpClient.get<Contributor[]>(`${this.baseUrl}`).pipe(
            tap((response: Contributor[]) => {
                this.contributors = response;
            }),
            catchError(() => of([] as Contributor[]))
        );
    }

    update(contributor: Contributor): Observable<Contributor> {
        return this._httpClient.put<Contributor>(`${this.baseUrl}/${contributor.id}`, contributor).pipe(
            tap((updated) => updated),
            catchError(() => of({} as Contributor))
        );
    }
}
