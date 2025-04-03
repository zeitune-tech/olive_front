import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { Restriction } from "./restriction.interface";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class RestrictionService {

    baseUrl = environment.request_url + '/restrictions';
    private _restriction: ReplaySubject<Restriction> = new ReplaySubject<Restriction>(1);
    private _restrictions: ReplaySubject<Restriction[]> = new ReplaySubject<Restriction[]>(1);


    set restriction(value: Restriction) {
        this._restriction.next(value);
    }

    get restriction$() {
        return this._restriction.asObservable();
    }

    set restrictions(value: Restriction[]) {
        this._restrictions.next(value);
    }

    get restrictions$() {
        return this._restrictions.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }


    create(restriction: any): Observable<Restriction> {
        return this._httpClient.post<Restriction>(`${this.baseUrl}`, 
            {}
        )
            .pipe(
                tap((restriction) => {
                    this.restriction = restriction;
                    return (restriction);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    update(restriction: Restriction): Observable<Restriction> {
        return this._httpClient.put<Restriction>(`${this.baseUrl}/${restriction.id}`, restriction)
            .pipe(
                tap((restriction) => {
                    this.restriction = restriction;
                    return (restriction);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    get(): Observable<Restriction> {
        return this._httpClient.get<Restriction>(`${this.baseUrl}/me`)
            .pipe(
                tap((restriction) => {
                    this.restriction = restriction;
                    return restriction;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    getAll(): Observable<Restriction[]> {
        return this._httpClient.get<Restriction[]>(`${this.baseUrl}`)
            .pipe(
                tap((response: any) => {
                    this.restrictions = response.map((restriction: Restriction) => {
                        return restriction;
                    });
                    return response;
                }),
                catchError(() => of([] as Restriction[]))
            );
    }
}